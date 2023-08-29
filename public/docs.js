import * as BABYLON from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import * as earcut from "earcut";
import {Inspector} from '@babylonjs/inspector';


const canvas = document.getElementById('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


async function main() {
    const engine = new BABYLON.Engine(canvas);
    
    
    
    const createScene = async function (engine) {
        const scene = new BABYLON.Scene(engine);

        // const camera = new BABYLON.ArcRotateCamera(
        //     "camera",
        //     -Math.PI / 2,
        //     Math.PI / 2.5,
        //     3,
        //     new BABYLON.Vector3(0, 0, 0),
        //     scene
        //     );
        
        const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 150, new BABYLON.Vector3(0, 60, 0));
         camera.attachControl(canvas, true);
        
        
        
        
        
        const light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            scene
            );
        
        const lgGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "/villageheightmap.png", 
        {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 4});
        
        
        const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
        largeGroundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/valleygrass.png");

        lgGround.position.y = -0.01;
        lgGround.material = largeGroundMat;
        
        
        const skybox = new BABYLON.MeshBuilder.CreateBox('skb',{size:150})
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/txb/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        //
        
        
        const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "/palmtree.png", 2000, {width: 512, height: 1024}, scene);
        
        
        for (let i = 0; i < 200; i++) {
            const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
            tree.position.x = Math.random() * (-30);
            tree.position.z = Math.random() * 20 + 8;
            tree.position.y = 0.5;
        }
        for (let i = 0; i < 200; i++) {
            const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
            tree.position.x = Math.random() * (25) + 7;
            tree.position.z = Math.random() * -35  + 8;
            tree.position.y = 0.5;
        }
        
        //
        
        
        const fountainProfile = [
        	new BABYLON.Vector3(0, 0, 0),
        	new BABYLON.Vector3(10, 0, 0),
        	new BABYLON.Vector3(10, 4, 0),
        	new BABYLON.Vector3(8, 4, 0),
        	new BABYLON.Vector3(8, 1, 0),
        	new BABYLON.Vector3(1, 2, 0),
        	new BABYLON.Vector3(1, 15, 0),
        	new BABYLON.Vector3(3, 17, 0)
        ];
        
        const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", {shape: fountainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        fountain.scaling = new BABYLON.Vector3(0.05,0.05,0.05)
        
            // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
    
        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("/flare.png", scene);
    
        // Where the particles come from
        particleSystem.emitter = new BABYLON.Vector3(0, 0.7, 0); // the starting object, the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.03, 0, 0); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.03, 0, 0); // To...
    
        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
    
        // Size of each particle (random between...
        particleSystem.minSize = 0.03;
        particleSystem.maxSize = 0.08;
    
        // Life time of each particle (random between...
        particleSystem.minLifeTime = 2;
        particleSystem.maxLifeTime = 3.5;
    
        // Emission rate
        particleSystem.emitRate = 1500;
    
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    
        // Set the gravity of all particles
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
    
        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new BABYLON.Vector3(-0.1, 1, 0.1);
        particleSystem.direction2 = new BABYLON.Vector3(0.1, 1, -0.1);
    
        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;
    
        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.025;
    
        // Start the particle system
        particleSystem.start();

       // particleSystem.scaling = new BABYLON.Vector3(0.05,0.05,0.05)
        
        
        //
        
           //the bulb to the parent
    const lampLight = new BABYLON.SpotLight("lampLight", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, -1, 0), Math.PI, 1, scene);
    lampLight.diffuse = BABYLON.Color3.Yellow();

	//shape to extrude
	const lampShape = [];
    for(let i = 0; i < 20; i++) {
        lampShape.push(new BABYLON.Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
    }
	lampShape.push(lampShape[0]); //close shape

	//extrusion path
    const lampPath = [];
	lampPath.push(new BABYLON.Vector3(0, 0, 0));
	lampPath.push(new BABYLON.Vector3(0, 10, 0));
    for(let i = 0; i < 20; i++) {
        lampPath.push(new BABYLON.Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
    }
    lampPath.push(new BABYLON.Vector3(3, 11, 0));

    const yellowMat = new BABYLON.StandardMaterial("yellowMat");
    yellowMat.emissiveColor = BABYLON.Color3.Yellow();

	//extrude lamp
	const lamp = BABYLON.MeshBuilder.ExtrudeShape("lamp", {cap: BABYLON.Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5},scene,earcut);
	
    //add bulb
    const bulb = BABYLON.MeshBuilder.CreateSphere("bulb", {diameterX: 1.5, diameterZ: 0.8});
    
    bulb.material = yellowMat;
    bulb.parent = lamp;
    bulb.position.x = 2;
    bulb.position.y = 10.5;

    lampLight.parent = bulb;

        lamp.scaling = new BABYLON.Vector3(0.1,0.1,0.1)
        
        
        lamp.position = new BABYLON.Vector3(2, 0, 2); 
        lamp.rotation = BABYLON.Vector3.Zero();
        lamp.rotation.y = -Math.PI / 4;

        const lamp3 = lamp.clone("lamp3");
        lamp3.position.z = -8;

        const lamp1 = lamp.clone("lamp1");
        lamp1.position.x = -8;
        lamp1.position.z = 1.2;
        lamp1.rotation.y = Math.PI / 2;

        const lamp2 = lamp1.clone("lamp2");
        lamp2.position.x = -2.7;
        lamp2.position.z = 0.8;
        lamp2.rotation.y = -Math.PI / 2;

        
        
        
        
        
        //
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:24, height:24});
        const groundMat = new BABYLON.StandardMaterial("groundMat");
        groundMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/villagegreen.png');
        
        // groundMat.diffuseTexture.uScale=10
        // groundMat.diffuseTexture.vScale=10
        ground.material = groundMat;
        
        const faceUV1 = [
        new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0), //back face
        new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0),//front face
        new BABYLON.Vector4(0.25, 0, 0.5, 1.0), //right side
        new BABYLON.Vector4(0.75, 0, 1.0, 1.0), //left side
        ]
        const faceUV2 = [
            new BABYLON.Vector4(0.60,0.0,1.0,1.0),
            new BABYLON.Vector4(0.0,0.0,0.40,1.0),
            new BABYLON.Vector4(0.40,0.0,0.60,1.0),
            new BABYLON.Vector4(0.40,0.0,0.60,1.0),
            ];
        
        function createHouse(name,faceUV, texture, scale = 1){
            
            const box = BABYLON.MeshBuilder.CreateBox(name+"box", {faceUV: faceUV, wrap: true}, scene);
            box.position.y = 0.5;
            box.scaling.x = scale;
            
            const roof = BABYLON.MeshBuilder.CreateCylinder(name+"roof", {diameter: 1.3, height: 1.2, tessellation: 3});
            roof.scaling.y = scale;
            roof.scaling.x = 0.74;
            roof.rotation.z = Math.PI / 2;
            roof.position.y = 1.22;
            
            
            const roofMat = new BABYLON.StandardMaterial(name+"roofMat");
            roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
            const boxMat = new BABYLON.StandardMaterial(name+"Mat");
            boxMat.diffuseTexture = new BABYLON.Texture(texture);
            roof.material = roofMat;
            box.material = boxMat;
            
            
            const house = BABYLON.Mesh.MergeMeshes([box,roof],true, false, null, false, true)
            return house;
        }
        
        const cubeHouse = createHouse('cubeHouse',faceUV1,'https://doc.babylonjs.com/img/getstarted/cubehouse.png')
        const semiHouse = createHouse('semiHouse',faceUV2,'https://doc.babylonjs.com/img/getstarted/semihouse.png',1.5)
        
        cubeHouse.rotation.y = -Math.PI / 16;
        cubeHouse.position.x = -6.8;
        cubeHouse.position.z = 2.5;

    
        semiHouse.rotation.y = -Math.PI / 16;
        semiHouse.position.x = -4.5;
        semiHouse.position.z = 3;

        
        
        
        
        const places = []; //each entry is an array [house type, rotation, x, z]
        
        
        places.push([1, -Math.PI / 16, -6.8, 2.5 ]);
        places.push([2, -Math.PI / 16, -4.5, 3 ]);
        places.push([2, -Math.PI / 16, -1.5, 4 ]);
        places.push([2, -Math.PI / 3, 1.5, 6 ]);
        places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
        places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
        places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
        places.push([1, 5 * Math.PI / 4, 0, -1 ]);
        places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
        places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
        places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
        places.push([2, Math.PI / 1.9, 4.75, -1 ]);
        places.push([1, Math.PI / 1.95, 4.5, -3 ]);
        places.push([2, Math.PI / 1.9, 4.75, -5 ]);
        places.push([1, Math.PI / 1.9, 4.75, -7 ]);
        places.push([2, -Math.PI / 3, 5.25, 2 ]);
        places.push([1, -Math.PI / 3, 6, 4 ]);
        
        
        const houses = [];
        for (let i = 0; i < places.length; i++) {
            if (places[i][0] === 1) {
                houses[i] = cubeHouse.createInstance("chouse" + i);
            }
            else {
                houses[i] = semiHouse.createInstance("shouse" + i);
            }
            houses[i].rotation.y = places[i][1];
            houses[i].position.x = places[i][2];
            houses[i].position.z = places[i][3];
        }

        // car  ch - 3
        
        const animWheel = new BABYLON.Animation("wheelAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            const wheelKeys = []; 
            
            //At the animation key 0, the value of rotation.y is 0
            wheelKeys.push({
                frame: 0,
                value: 0
            });
            
            //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
            wheelKeys.push({
                frame: 30,
                value: 2 * Math.PI
            });
            
            //set the keys
            animWheel.setKeys(wheelKeys);
            
            //Link this animation to the right back wheel
            // wheelRB.animations = [];
            // wheelRB.animations.push(animWheel);
            
            //Begin animation - object to animate, first frame, last frame and loop if true
            // scene.beginAnimation(wheelRB, 0, 30, true);
            
        BABYLON.SceneLoader.ImportMeshAsync("", "./", "scene.babylon").then(() =>  {
            const car = scene.getMeshByName("car");
            car.rotation = new BABYLON.Vector3(-Math.PI/2, Math.PI/2, 0);
            car.position.y = 0.16;
            car.position.x = 3;
            car.position.z = 8;
    
            const animCar = new BABYLON.Animation("carAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    
            const carKeys = []; 
    
            carKeys.push({
                frame: 0,
                value: 8
            });
    
            carKeys.push({
                frame: 150,
                value: -7
            });
    
            carKeys.push({
                frame: 200,
                value: -7
            });
    
            animCar.setKeys(carKeys);
    
            car.animations = [];
            car.animations.push(animCar);
    
            scene.beginAnimation(car, 0, 200, true);
          
            
            
            
            
            const wheelRB = scene.getMeshByName("wheelRB");
            wheelRB.animations = [];
            wheelRB.animations.push(animWheel);
            const wheelRF = scene.getMeshByName("wheelRF");
            wheelRF.animations = [];
            wheelRF.animations.push(animWheel);
            const wheelLB = scene.getMeshByName("wheelLB");
            wheelLB.animations = [];
            wheelLB.animations.push(animWheel);
            const wheelLF = scene.getMeshByName("wheelLF");
            wheelLF.animations = [];
            wheelLF.animations.push(animWheel);
        
            scene.beginAnimation(wheelRB, 0, 30, true);
            scene.beginAnimation(wheelRF, 0, 30, true);
            scene.beginAnimation(wheelLB, 0, 30, true);
            scene.beginAnimation(wheelLF, 0, 30, true);
        });
        
        //
                
        const walk = function (turn, dist) {
            this.turn = turn;
            this.dist = dist;
        }
        
        const track = [];
        track.push(new walk(86, 7));
        track.push(new walk(-85, 14.8));
        track.push(new walk(-93, 16.5));
        track.push(new walk(48, 25.5));
        track.push(new walk(-112, 30.5));
        track.push(new walk(-72, 33.2));
        track.push(new walk(42, 37.5));
        track.push(new walk(-98, 45.2));
        track.push(new walk(0, 47))
    
        // Dude
        BABYLON.SceneLoader.ImportMeshAsync("him", "/", "Dude.babylon", scene).then((result) => {
            var dude = result.meshes[0];
            camera.parent = dude;
            
            ////
            
            BABYLON.SceneLoader.ImportMeshAsync("", "./", "wepon.glb").then((wp) =>  {
            const weapon = scene.getMeshByName("__root__");
            weapon.scaling =new  BABYLON.Vector3(0.1,0.1,0.1)
            weapon.parent = dude
            
        })
            
            ////
            
            
            
            
            dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);
                
            dude.position = new BABYLON.Vector3(-6, 0, 0);
            dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
            const startRotation = dude.rotationQuaternion.clone();    
                
            scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
    
            let distance = 0;
            let step = 0.015;
            let p = 0;
    
            scene.onBeforeRenderObservable.add(() => {
    		    dude.movePOV(0, 0, step);
                distance += step;
                  
                if (distance > track[p].dist) {
                        
                    dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);
                    p +=1;
                    p %= track.length; 
                    if (p === 0) {
                        distance = 0;
                        dude.position = new BABYLON.Vector3(-6, 0, 0);
                        dude.rotationQuaternion = startRotation.clone();
                    }
                }
    			
            })
        });
        
        
        
        
        
        
        
        
        
        
        
        //
        
        
        
        //
        
        
        
        
        
        
        return scene;
    };
    
    const scene = await createScene(engine);
    
    

    engine.runRenderLoop(function(){
        scene.render();
    });
    
    window.addEventListener("resize",()=>{
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        engine.resize();
    });
    
    Inspector.Show(scene,{})
    
}

window.onload = ()=>{
    eruda.init()
    main()
    
}