import {Scalar} from '@babylonjs/core';

import MovementPad,{_InputState, _VelocityCalculator} from './MovementPad';
//import RotationPad from './RotationPad';
import ActionButtonManager from './ActionButton'
/**
 * utility class for touch input handle
 * @class
 */
export default class InputHandler{
    /**
     * Creates an instance of Player with input state and velocity calculator .
     * @constructor
     */
    constructor(container, canvas){
        this.canvas = canvas;
        this.container = container;
        this.controls = new MovementPad(this.container, this.canvas);
        //this.RotationControls = new RotationPad(this.container, this.canvas);
        this.inputState = new _InputState(this.controls);
        this._VelocityHandler = new _VelocityCalculator();
        this.inputState.onAfterTrySetState = (state)=>this.__moveHandler(state);
        this.inputState.onend = (state)=>this.__endHandler(state);
        this.ActionButtonManager = new ActionButtonManager(this.container);
        this._addJumpButton()
        this.jumpButtonPressed = false
    }
    /**
     * when the touch pad move , __moveHandler will callled with current touch state
     * @param {Object} state - if need the state on __moveHandler 
     * @private
     */
    __moveHandler(state){
        this._VelocityHandler.update(this.inputState)
    }
    /**
     * when touch pad released this method will called with last state value.
     * @param {Object} state - if need the state on __moveHandler
     * @private
     */
    __endHandler(state){
        this._VelocityHandler.resetToZero()
    }
    /**
     * it's run every render loop and check keys
     * @public
     */
    _updateFromKeyboard() {
        if (this.inputState.State["moveForward"]) {
            this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
            this.verticalAxis = 1;
    
        } else if (this.inputState.State["moveBackward"]) {
            this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
            this.verticalAxis = -1;
        } else {
            this.vertical = 0;
            this.verticalAxis = 0;
        }
    
        if (this.inputState.State["moveLeft"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
            this.horizontalAxis = -1;
    
        } else if (this.inputState.State["moveRight"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
            this.horizontalAxis = 1;
        }
        else {
            this.horizontal = 0;
            this.horizontalAxis = 0;
        }
    }
    
    
    _addJumpButton(){
        let jumpbtn = this.ActionButtonManager.create('jumpButtonPressed',50,{
            x:30,
            y:100
        },{
            x:'right',
            y:'bottom'
        });
        this.ActionButtonManager.attachTouch(jumpbtn,(s)=>{
            this.jumpButtonPressed = s
        })
    }
}