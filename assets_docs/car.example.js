function createCar(){
            const carUv = [];
            carUv[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
            carUv[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
            carUv[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);
            
            const wheelUV = [];
            wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
            wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
            wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);
            //base
            
            const outline = [
                new BABYLON.Vector3(-0.3, 0, -0.1),
                new BABYLON.Vector3(0.2, 0, -0.1),
            ]
            
            //curved front
            for (let i = 0; i < 20; i++) {
                outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
            }
            
            //top
            outline.push(new BABYLON.Vector3(0, 0, 0.1));
            outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));
            const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2,faceUV:carUv,wrap:true},scene,earcut);
            
            const carMat = new BABYLON.StandardMaterial('carmat');
            carMat.diffuseTexture = new BABYLON.Texture('https://doc.babylonjs.com/img/getstarted/car.png')
            car.material = carMat;
            
            // wheel
            const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05, faceUV: wheelUV})
            wheelRB.parent = car;
            wheelRB.position.z = -0.1;
            wheelRB.position.x = -0.2;
            wheelRB.position.y = 0.035;
        
            const wheelMat = new BABYLON.StandardMaterial('wheelMat');
            wheelMat.diffuseTexture = new BABYLON.Texture('https://doc.babylonjs.com/img/getstarted/wheel.png');
            
            wheelRB.material = wheelMat;
            
            const wheelRF = wheelRB.clone("wheelRF");
            wheelRF.position.x = 0.1;
            
            const wheelLB = wheelRB.clone("wheelLB");
            wheelLB.position.y = -0.2 - 0.035;
            
            const wheelLF = wheelRF.clone("wheelLF");
            wheelLF.position.y = -0.2 - 0.035;
            
            return car;
        }
        
        
        const car = createCar();
        car.rotation.x = -Math.PI / 2;