import { TransformNode, UniversalCamera, Vector3, Quaternion , Ray, SceneLoader} from '@babylonjs/core';
/**
 * Represents the Player class.
 * @class
 */
export class Player extends TransformNode {
    /**
     * Creates an instance of Player.
     * @constructor
     * @param {Object} assets - This contain player mesh and other assets
     * @param {Scene} scene - It's contain an instance of BABYLON.Scene class
     * @param {ShadowGenerator} shadowGenerator - It's contain an instance of BABYLON.ShadowGenerator class
     * @param {InputHandler} input - instance of InputHandler class at ./InputHandler
     */
    constructor(assets, scene, shadowGenerator, input=null) {
        super("player", scene);
        // -------------constants---------------
        this.PLAYER_SPEED = 0.25;
        this.JUMP_FORCE = 0.80;
        this.GRAVITY = -2.8;
        this.DASH_FACTOR = 2.5;
        this.DASH_TIME = 10; //how many frames the dash lasts
        this.DOWN_TILT = new Vector3(0.8290313946973066, 0, 0);
        this.ORIGINAL_TILT = new Vector3(0.5934119456780721, 0, 0);
        //-------------constants---------------
        this.scene = scene;
        this._setupPlayerCamera();
        this._assets = assets
        this.mesh = this._assets.mesh;
        this.mesh.parent = this; // outer of player
        
        shadowGenerator.addShadowCaster(assets.mesh); //the player mesh will cast shadows

        this._input = input; //inputs we will get from inputHandler.js
        this._moveDirection = Vector3.Zero()
        this._gravity = new Vector3(0,0,0);
        this.grounded = true;
        this._lastGroundPos = new Vector3(0,0,0); // keep track of the last grounded position
        
    }
    /**
     * camera setup  for following player
     * @private
     */
    _setupPlayerCamera() {
        //root camera parent that handles positioning of the camera to follow the player
        this._camRoot = new TransformNode("root");
        this._camRoot.position = new Vector3(0, 0, 0); //initialized at (0,0,0)
        //to face the player from behind (180 degrees)
        this._camRoot.rotation = new Vector3(0, Math.PI, 0);
    
        //rotations along the x-axis (up/down tilting)
        let yTilt = new TransformNode("ytilt");
        //adjustments to camera view to point down at our player
        yTilt.rotation = this.ORIGINAL_TILT;
        this._yTilt = yTilt;
        yTilt.parent = this._camRoot;
    
        //our actual camera that's pointing at our root's position
        this.camera = new UniversalCamera("cam", new Vector3(0, 0, -30), this.scene);
        this.camera.lockedTarget = this._camRoot.position;
        this.camera.fov = 0.47350045992678597;
        this.camera.parent = yTilt;
        this.scene.activeCamera = this.camera;
        return this.camera;
    }
    /**
     * update camera is update the position of camera from Player position
     * @private
     * @see https://doc.babylonjs.com/guidedLearning/createAGame/playerCamera
     */
    _updateCamera() {
        let centerPlayer = this.mesh.position.y + 2;
        this._camRoot.position = Vector3.Lerp(
            this._camRoot.position,
            new Vector3(this.mesh.position.x,
            centerPlayer,
            this.mesh.position.z
            ), 0.4);
        // this._camRoot.position.copyFrom(this.mesh.position)
        // this._camRoot.rotation.copyFrom(this.mesh.rotation)
    }
    /**
     * it's check collision and update input state and set camera move direction
     * @private
     * @see https://doc.babylonjs.com/guidedLearning/createAGame/characterMovePt1
     */
    _beforeRenderUpdate() {
        //
        this._h = this._input._VelocityHandler.velocity.x; //x-axis
        this._v = -this._input._VelocityHandler.velocity.z; //z-axis
        
        let fwd = this._camRoot.forward;
        let right = this._camRoot.right;
        let correctedVertical = fwd.scaleInPlace(this._v);
        let correctedHorizontal = right.scaleInPlace(this._h);
        let move = correctedHorizontal.addInPlace(correctedVertical);
        this._moveDirection = new Vector3((move).normalize().x, 0, (move).normalize().z);
        //clamp the input value so that diagonal movement isn't twice as fast
        let inputMag = Math.abs(this._h) + Math.abs(this._v);
        if (inputMag < 0) {
            this._inputAmt = 0;
        } else if (inputMag > 1) {
            this._inputAmt = 1;
        } else {
            this._inputAmt = inputMag;
        }
        this._moveDirection = this._moveDirection.scaleInPlace(this._inputAmt*this.PLAYER_SPEED);
        
        
        
        //
        
        this._input._updateFromKeyboard();
        this._updateFromControls()
        this._updateGroundDetection();
    }
    _updateFromControls(){
        this._deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
        let input = new Vector3(this._input.horizontalAxis, 0, this._input.verticalAxis); //along which axis is the direction
        if (input.length() == 0) {//if there's no input detected, prevent rotation and keep player in same rotation
            return;
        }
        let angle = Math.atan2(this._input.horizontalAxis, -this._input.verticalAxis);
        angle += this._camRoot.rotation.y;
        let targ = Quaternion.FromEulerAngles(0, -angle, 0);
        this.mesh.rotationQuaternion = Quaternion.Slerp(this.mesh.rotationQuaternion, targ, 10 * this._deltaTime);
    }
    _floorRaycast(offsetx, offsetz, raycastlen) {
        //position the raycast from bottom center of mesh
        let raycastFloorPos = new Vector3(this.mesh.position.x + offsetx, this.mesh.position.y + 0.5, this.mesh.position.z + offsetz);
        let ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);

        //defined which type of meshes should be pickable
        let predicate = function (mesh) {
            return mesh.isPickable && mesh.isEnabled();
        }

        let pick = this.scene.pickWithRay(ray, predicate);

        if (pick.hit) { //grounded
            return pick.pickedPoint;
        } else { //not grounded
            return Vector3.Zero();
        }
    }
    //raycast from the center of the player to check for whether player is grounded
    _isGrounded() {
        if (this._floorRaycast(0, 0, .6).equals(Vector3.Zero())) {
            return false;
        } else {
            return true;
        }
    }
    _updateGroundDetection(){
        //console.log(this._input.jumpButtonPressed);
        if (!this._isGrounded()) {
            this._gravity = this._gravity.addInPlace(Vector3.Up().scale(this._deltaTime * this.GRAVITY));
            this._grounded = false;
            if (this.mesh.position.y < -10) {
                this.mesh.position.copyFrom(this._lastGroundPos);
            }
        }
        if (this._gravity.y < -this.JUMP_FORCE) {
            this._gravity.y = -this.JUMP_FORCE;
        }
        if (this._isGrounded()) {
            this._gravity.y = 0;
            this._grounded = true;
            this._lastGroundPos.copyFrom(this.mesh.position);
            this._jumpCount = 1; //allow for jumping
        }
        if (this._input.jumpButtonPressed && this._jumpCount > 0) {
          this._gravity.y = this.JUMP_FORCE;
          this._jumpCount--;
        }
        this.mesh.moveWithCollisions(this._moveDirection.addInPlace(this._gravity));
    }
    /**
     * this activatePlayerCamera will call from main.js at _initializeGameAsync
     * @public
     */
    activatePlayerCamera() {
        this.scene.registerBeforeRender(() => {
            this._beforeRenderUpdate();
            this._updateCamera();
        })
        return this.camera;
    }
}


export async function loadPlayerModel(BABYLON, scene) {
    //collision mesh
    const outer = BABYLON.MeshBuilder.CreateBox("outer", { width: 2, depth: 1, height: 3 }, scene);
    outer.isVisible = false;
    outer.isPickable = false;
    outer.checkCollisions = true;
    
    //move origin of box collider to the bottom of the mesh (to match imported player mesh)
    outer.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, 1.5, 0));
    //for collisions
    outer.ellipsoid = new Vector3(1, 1.5, 1);
    outer.ellipsoidOffset = new Vector3(0, 1.5, 0);
    
    outer.rotationQuaternion = new BABYLON.Quaternion(0, Math.PI/2, 0, 0); // rotate the player mesh 180 since we want to see the back of the player
    /*const box = BABYLON.MeshBuilder.CreateBox("Small1", { width: 0.5, depth: 0.5, height: 0.25, faceColors: [
        new BABYLON.Color4(0, 0, 0, 1),
        new BABYLON.Color4(0, 0, 0, 1),
        new BABYLON.Color4(0, 0, 0, 1),
        new BABYLON.Color4(0, 0, 0, 1),
        new BABYLON.Color4(0, 0, 0, 1),
        new BABYLON.Color4(0, 0, 0, 1)
        ] }, scene);
    box.position.y = 1.5;
    box.position.z = 1;
    
    const body = BABYLON.Mesh.CreateCylinder("body", 3, 2, 2, 0, 0, scene);
    const bodymtl = new BABYLON.StandardMaterial("red", scene);
    bodymtl.diffuseColor = new BABYLON.Color3(0.8, 0.5, 0.5);
    body.material = bodymtl;
    body.isPickable = false;
    body.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, 1.5, 0)); // simulates the imported mesh's origin
    
    //parent the meshes
    box.parent = body;*/
    const result = await SceneLoader.ImportMeshAsync("", "/public/", "animated_low-poly_spider_game-ready.glb", scene)
    const root = result.meshes[0];
    root.scaling = root.scaling.multiply(new Vector3(0.05, 0.05, 0.05))
    
    result.animationGroups[0].stop()
    //body is our actual player mesh
    const body = root;
    body.parent = outer;
    body.isPickable = false;
    body.getChildMeshes().forEach(m => {
        m.isPickable = false;
    })
    
    
    return {
        mesh: outer,
        animationGroups:result.animationGroups
    }
}


// @deprecated
    // _beforeRenderUpdate() {
    //     //
    //     this._h = this._input.horizontal; //x-axis
    //     this._v = this._input.vertical; //z-axis
        
    //     let fwd = this._camRoot.forward;
    //     let right = this._camRoot.right;
    //     let correctedVertical = fwd.scaleInPlace(this._v);
    //     let correctedHorizontal = right.scaleInPlace(this._h);
    //     let move = correctedHorizontal.addInPlace(correctedVertical);
    //     this._moveDirection = new Vector3((move).normalize().x, 0, (move).normalize().z);
    //     //clamp the input value so that diagonal movement isn't twice as fast
    //     let inputMag = Math.abs(this._h) + Math.abs(this._v);
    //     if (inputMag < 0) {
    //         this._inputAmt = 0;
    //     } else if (inputMag > 1) {
    //         this._inputAmt = 1;
    //     } else {
    //         this._inputAmt = inputMag;
    //     }
    //     this._moveDirection = this._moveDirection.scaleInPlace(this._inputAmt*0.1 );
        
    //     this.mesh.moveWithCollisions(this._moveDirection);
    //     //
        
    //     this._input._updateFromKeyboard();
    //     // this._updateGroundDetection();
    // }
