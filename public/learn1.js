import * as BABYLON from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import {Inspector} from '@babylonjs/inspector';

const canvas = document.getElementById('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


async function main() {
    const engine = new BABYLON.Engine(canvas);
    
    
     
    const createScene = async function (engine) {
        const scene = new BABYLON.Scene(engine);

        const hk = await HavokPhysics();
        scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.HavokPlugin(true, hk));
        
        
        
            // const camera = new BABYLON.ArcRotateCamera(
            //     "camera",
            //     -Math.PI / 2,
            //     Math.PI / 2.5,
            //     3,
            //     new BABYLON.Vector3(0, 0, 0),
            //     scene
            //     );
            const camera = new BABYLON.FreeCamera(
                "camera1",
                new BABYLON.Vector3(0, 10, -30),
                scene
            );
            camera.attachControl(canvas, true);
            const light = new BABYLON.HemisphericLight(
                "light",
                new BABYLON.Vector3(0, 1, 0),
                scene
                );
            const lgGround = BABYLON.MeshBuilder.CreateBox("largeGround", 
            {width:150, height:1,depth:150});
            
            
            const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
            largeGroundMat.diffuseTexture = new BABYLON.Texture('/cs.jpg');
            largeGroundMat.specularColor = new BABYLON.Color3(0, 0, 0);
            // largeGroundMat.diffuseTexture.uScale = 1
            // largeGroundMat.diffuseTexture.vScale = 1
            lgGround.material = largeGroundMat;
            // skb
            // const skybox = new BABYLON.MeshBuilder.CreateBox('skb',{size:150})
            // const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
            // skyboxMaterial.backFaceCulling = false;
            // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/txb/skybox", scene);
            // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            // skybox.material = skyboxMaterial;
            
            
            // const skybox_aggregate = new BABYLON.PhysicsAggregate(skybox, BABYLON.PhysicsShapeType.MESH,{
            //     mass:0,
            // }, scene)
            // console.log(skybox_aggregate);
            
            // const ground_aggregate = new BABYLON.PhysicsAggregate(lgGround,BABYLON.PhysicsShapeType.BOX,{mass:0, friction:0.2, restitution:0.3},scene)
            
            
        const ground = lgGround;

        
        const groundShape = new BABYLON.PhysicsShapeMesh(
            ground,
            scene
        );
        const groundBody = new BABYLON.PhysicsBody(
            ground,
            BABYLON.PhysicsMotionType.STATIC,
            false,
            scene
        );
        const groundMaterial = { friction: 0.2, restitution: 0.3 };
        groundShape.material = groundMaterial;
        groundBody.shape = groundShape;
        groundBody.setMassProperties({
            mass: 0,
        });
        ground.receiveShadows = true;
        function CreateSphere (){
            const sphere = BABYLON.MeshBuilder.CreateSphere("sphere");
            sphere.position.y = Math.random()*50+3;
            sphere.position.x = Math.random();
            sphere.position.z = Math.random();
            
            const aggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 20, restitution:0.5 }, scene);
            // 
            return {sphere,aggregate}
        }
        
        
        // for (let i = 0; i < 50; i++) {
        //     CreateSphere()
        // }
        
        CreateSphere()
        // CreateSphere()
        // CreateSphere()
        /*
        // const box = BABYLON.MeshBuilder.CreateBox("box",{height:5,width:5, depth:5});
        // box.position.y = Math.random()*50+3;
        // box.position.x = Math.random();
        // box.position.z = Math.random();
        
        // const aggregate = new BABYLON.PhysicsAggregate(box, BABYLON.PhysicsShapeType.BOX, { mass: 0.001 }, scene);
        // // 
        // console.log(aggregate);
        */
        // for (let i = 0; i < 10; i++) {
            
        
        // const box = BABYLON.MeshBuilder.CreateBox("box",{height:5,width:5, depth:5},scene);
        // box.position.y=Math.random()*50+50
        // const boxShape = new BABYLON.PhysicsShapeBox(
        //     new BABYLON.Vector3(0,0,0),
        //     new BABYLON.Quaternion(0, 0, 0, 1),
        //     new BABYLON.Vector3(5, 5, 5),
        //     scene
        // );
        // const boxShape = new BABYLON.PhysicsShapeSphere(
        //     new BABYLON.Vector3(0,0,0),
        //     5,
        //     scene
        // );
        // const boxBody = new BABYLON.PhysicsBody(
        //     box,
        //     BABYLON.PhysicsMotionType.DYNAMIC,
        //     false,
        //     scene
        // );
        // boxShape.material = {
        //     friction: 1,
        //     restitution:10
        // }
        // boxBody.shape = boxShape
        // boxBody.setMassProperties({
        //     mass: 1,
        // });
        //}
        
        
        /*
        // const body = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
        
        // body.setMassProperties({
        //   mass: 1,
        //   centerOfMass: new BABYLON.Vector3(0, 1, 0),
        //   inertia: new BABYLON.Vector3(1, 1, 1),
        //   inertiaOrientation: new BABYLON.Quaternion(0, 0, 0, 1)
        // });
        
        // // const shape = new BABYLON.PhysicsShapeSphere(
        // //   new BABYLON.Vector3(0,0,0), 
        // //   0.5, 
        // //   scene
        // // );
        
        // const shape = new BABYLON.PhysicsShapeConvexHull(sphere, scene)
        
        // body.shape = shape;
        
        //console.log(BABYLON.PhysicsShapeType.CONVEX_HULL);
        
        
        //camera.isRigCamera = true
        
        // camera.ellipsoid = new BABYLON.Vector3(1,1,1)
        // const camera_aggregate = new BABYLON.PhysicsAggregate(camera.position,BABYLON.PhysicsShapeType.BOX,{mass:1},scene)
        
        
        // const {box} = CreateBox();
        //CreateBox('n')
        
        
        
        // scene.onBeforeRenderObservable.add(()=>{
        //     //console.log('m');
        // })
        */
        
        camera.position.y=50
        console.log(camera);
        camera.applyGravity = true;
        camera.checkCollisions=true;
        scene.gravity = new BABYLON.Vector3(0,-9.81,0)
        camera.needMoveForGravity = true
        ground.checkCollisions = true
        
        
        return scene;
    }
    
    
    
    const scene = await createScene(engine);
    
    engine.runRenderLoop(function(){
        scene.render();
    });
    window.addEventListener("resize",()=>{
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        engine.resize();
    });
    //Inspector.Show(scene,{})
}

window.onload = ()=>{
    eruda.init()
    main()
}



