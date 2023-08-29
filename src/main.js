/**
 * babylon import 
 * @type {BABYLON}
 */
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
/**
 * utility imports
 */
import DomLoader from './DomLoader';
import { State , VanillaEnumState } from './VanillaState';
import {Environment} from './Environment';
import {Player, loadPlayerModel} from './Player';
import InputHandler from './InputHandler';
/**
 * Represents the main application class.
 * @class
 */
class App {
    /**
     * Creates an instance of App.
     * @constructor
     */
    constructor() {
        // Babylon.js and DOM setup
        this._BABYLON = BABYLON;
        this._domLoader = new DomLoader(['canvas', 'fullscreen', 'debug']);

        // Canvas, engine, and scene setup
        this._canvas = this._domLoader.loadedDoms.canvas;
        this.resizeCanvas();
        this._engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(this._engine);
        this.__handleDom();

        // State setup
        this.appState = null;
        this._setupState();

        // Main logic execution
        this.__main__();
    }

    /**
     * The main execution logic of the application.
     * @private
     */
    async __main__() {
        // TODO: Implement your game logic, scene setup, rendering loop, etc.
        await this._setupGame()
        await this._goToGame()
        
        // render loop 
        this._render()
    }
    
    
    
    /**
     * _setupGame is a intent for switching app page and load assets
     * @private
     */
     
    async _setupGame(){
        this._engine.displayLoadingUI();
        let scene = new BABYLON.Scene(this._engine);
        this._gamescene = scene;
        // TODO: load asset's 
        // ENV loading
        const environment = new Environment(scene);
        this._environment = environment;
        await this._environment.load();
        // character assets
        await this._loadCharacterAssets(scene);
     }
     
     
     
     /**
      * start environment of game
      * @private
    */
    
    async _goToGame(){
        this._scene.detachControl();
        let scene = this._gamescene;
        scene.clearColor = new BABYLON.Color4(0.01568627450980392, 0.01568627450980392, 0.20392156862745098);
        
        // Initialize game
        await this._initializeGameAsync(scene);
        //--WHEN SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this._engine.hideLoadingUI();
        //
        scene.getMeshByName("outer").position = new BABYLON.Vector3(0, 3, 0);
        //
        this._scene.dispose();
        this.appState.State = this.appState._params.enums.GAME;
        this._scene = scene;
        //the game is ready, attach control back
        this._scene.attachControl();
  }
  
  /**
   * _loadCharacterAssets create a character model or load from file
   * @private
   */
   async _loadCharacterAssets(scene){
        return loadPlayerModel(BABYLON,scene).then((assets) => {
            this.assets = assets;
        });
   }
  
    /**
     * Initialize player, light, and cameras
     * @private
     */
     
    async _initializeGameAsync(scene) {
        //temporary light to light the entire scene
        var light0 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    
        const light = new BABYLON.PointLight("sparklight", new BABYLON.Vector3(0, 0, 0), scene);
        light.diffuse = new BABYLON.Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
        light.intensity = 35;
        light.radius = 1;
    
        const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.darkness = 0.4;
        
        this._input = new InputHandler(document.body, this._canvas); //detect mobile touch inputs
        //Create the player
        this._player = new Player(this.assets, scene, shadowGenerator,this._input); //dont have inputs yet so we dont need to pass it in
        const camera = this._player.activatePlayerCamera();
        
    }
    
    
    
    /**
     * run _render loop for updating BABYLON Engine when app state is includes enumerated value
     * @private
     */
     
     _render(){
         
        this._engine.runRenderLoop(() => {
            if (Object.values(this.appState.enums).includes(this.appState.State))
                this._scene.render();
            
        });
     }
     
     
     
    /**
     * Sets up the application and game states.
     * @private
     */
     
    _setupState() {
        // App state setup
        let appEnums = { START: 0, GAME: 1, LOSE: 2, CUTSCENE: 3 };
        this.appState = new VanillaEnumState({
            enums: appEnums,
            initialState: appEnums.START
        });

        // TODO: Game state setup
    }




    /**
     * Resizes the canvas to match the window dimensions.
     * @private
     */
     
    resizeCanvas() {
        this._canvas.height = window.innerHeight;
        this._canvas.width = window.innerWidth;
    }
    
    
    
    /**
     * Handles DOM elements and event listeners.
     * @private
     */
    __handleDom() {
        this.resizeCanvas();
        // Toggle debug layer visibility
        this._domLoader.loadedDoms.debug.addEventListener("click", () => {
            if (this._scene.debugLayer.isVisible())
                this._scene.debugLayer.hide();
            else this._scene.debugLayer.show();
        });
        // Resize canvas when window size changes
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this._engine.resize();
        });
    }
}

// Initialize the app when the page is fully loaded
window.onload = () => {
    eruda.init(); // Initialize Eruda debugger
    new App();
};