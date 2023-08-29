import { Vector3, MeshBuilder, SceneLoader } from '@babylonjs/core';

export class Environment {
    constructor(scene) {
        this._scene = scene;
    }

    async load() {
        const assets = await this._loadAsset();
        assets.allMeshes.forEach(m => {
            m.receiveShadows = true;
            m.checkCollisions = true;
        });

    }
    async _loadAsset() {
        //loads game environment
        const result = await SceneLoader.ImportMeshAsync(null, "../assets_docs/", "lowpoly__fps__tdm__game__map.glb", this._scene);

        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();
        env.scaling = env.scaling.multiply(new Vector3(5,5,5))
        env.rotation = new Vector3(0,Math.PI/2,0)
        
        //extract the actual lantern mesh from the root of the mesh that's imported, dispose of the root
        return {
            env: env,
            allMeshes: allMeshes,
        }
    }

}