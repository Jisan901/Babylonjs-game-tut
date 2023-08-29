import * as BABYLON from "@babylonjs/core";


const canvas = document.getElementById('canvas');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
function main() {
    
    const engine = new BABYLON.Engine(canvas);
    
    const scene = new BABYLON.Scene(engine);
    
    scene.createDefaultCameraOrLight(true, false, true)
    //scene.createDefaultLight(true, false, true)
    
    // const camera = new BABYLON.UniversalCamera('camera',new BABYLON.Vector3(0,5,-10),scene)
    
    // camera.attachControl(true)
    // camera.inputs.addTouch();
    // camera.setTarget(BABYLON.Vector3.Zero())
    
    
    // const camera = new BABYLON.FreeCamera('camera',new BABYLON.Vector3(0,8,0),scene)
    
    // camera.attachControl(true)
    
    
    // const box = new BABYLON.MeshBuilder.CreateBox('mybox',{
    //     size:0.1,
    //     width:1,
    //     height:1,
    //     depth:1,
    //     // faceColors:[
    //     //     BABYLON.Color3.Green()
    //     //     ]
    // });
    
    // const boxMaterial = new BABYLON.StandardMaterial();
    // box.material = boxMaterial;
    
    // boxMaterial.diffuseColor = new BABYLON.Color3(0,0,1);
    //boxMaterial.diffuseTexture = new BABYLON.Texture('/hm.jpeg');
    
    const sphere = new BABYLON.MeshBuilder.CreateSphere("my-sphere",{
        segments:50,
        diameter:0.3,
    },scene);
    sphere.position.y=7
    sphere.position.x=0.5
    sphere.ellipsoid = new BABYLON.Vector3(1,1,1)
    sphere.applyGravity = true;
    sphere.checkCollisions = true;
    
    const ground = new BABYLON.MeshBuilder.CreateGround('ground1',{
        height:10,
        width:10,
        subdivisions:5,
        subdivisionsX:10,
    })
    
    
    // ground.material = new BABYLON.StandardMaterial();
    
    // ground.material.wireframe = true;
    
    // const ground = new BABYLON.MeshBuilder.CreateGroundFromHeightMap('ground2','/hm.jpeg',{
    //     height:10,
    //     width:10,
    //     subdivisions:100,
    //     minHeight:4,
    //     maxHeight:4.6,
    // })
    // ground.material = new BABYLON.StandardMaterial();
    
    // ground.material.wireframe = true;
    
    
    
    
    scene.gravity = new BABYLON.Vector3(0,-9.81/40,0)
    
    scene.collisionsEnabled = true;
    
    //ground.checkCollisions = true;
    
    console.log(ground);
    
    // camera.applyGravity = true;
    // camera.checkCollisions = true;
    // camera.ellipsoid = new BABYLON.Vector3(1,1,1)
    
    //camera.rotation.x = Math.PI/2
    
    engine.runRenderLoop(function(){
        scene.render();
    });
    
    // function animate(){
    //     scene.render()
    //     requestAnimationFrame(animate)
    // }
    // animate()
    
    window.addEventListener("resize",()=>{
        engine.resize();
    });
    
}

window.onload = ()=>{
    eruda.init()
    main()
    
}