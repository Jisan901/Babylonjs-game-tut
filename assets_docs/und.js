var bindBodyShape = function (mesh, shape, scene) {
    mesh.material = bodyRenderingMaterial;
    if (mesh.getDescendants && mesh.getDescendants().length) {
        mesh.getDescendants().forEach((d) => {
            d.material = bodyRenderingMaterial;
        });
    }

    var body = new BABYLON.PhysicsBody(
        mesh,
        BABYLON.PhysicsMotionType.DYNAMIC,
        false,
        scene
    );

    shape.material = physicsMaterial;
    body.shape = shape;
    body.setMassProperties({
        mass: 1,
    });
};

var AddBody = function (scene, position, shadowGen, viewer) {
    var box = BABYLON.MeshBuilder.CreateBox("root", { size: 1 });
    box.position = position;

    shadowGen.addShadowCaster(box);

    var boxShape = new BABYLON.PhysicsShapeBox(
        new BABYLON.Vector3(0, 0, 0),
        BABYLON.Quaternion.Identity(),
        new BABYLON.Vector3(1, 1, 1),
        scene
    );

    bindBodyShape(box, boxShape, scene);

    if (viewer) {
        viewer.showBody(box.physicsBody);
    }

    return box;
};

var WorldBuild = function (ground, groundShape, scene, shadowGen) {
    var groundBody = new BABYLON.PhysicsBody(
        ground,
        BABYLON.PhysicsMotionType.STATIC,
        false,
        scene
    );
    var groundMaterial = { friction: 0.2, restitution: 0.3 };

    groundShape.material = groundMaterial;
    groundBody.shape = groundShape;
    groundBody.setMassProperties({
        mass: 0,
    });

    ground.receiveShadows = true;
    shadowGen.addShadowCaster(ground);
};

var BoxWorld = function (scene, position, size, viewer, shadowGen) {
    var name = "boxWorld_" + Date.now();
    console.log("creating box world", name);
    var ground = BABYLON.Mesh.CreateGround(name, size, size, 2, scene);
    ground.position = position;
    var groundShape = new BABYLON.PhysicsShapeBox(
        new BABYLON.Vector3(0, 0, 0),
        BABYLON.Quaternion.Identity(),
        new BABYLON.Vector3(size, 0.1, size),
        scene
    );
    WorldBuild(ground, groundShape, scene, shadowGen);
    viewer.showBody(ground.physicsBody);
};

var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera(
        "camera1",
        new BABYLON.Vector3(0, 10, -30),
        scene
    );

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    var dirLight = new BABYLON.DirectionalLight(
        "dirLight",
        new BABYLON.Vector3(0, -1, 1)
    );
    dirLight.autoCalcShadowZBounds = true;
    dirLight.intensity = 0.2;
    var shadowGen = new BABYLON.ShadowGenerator(1024, dirLight);
    shadowGen.bias = 0.01
    shadowGen.usePercentageCloserFiltering = true;

    var advancedTexture =
        BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var panel = new BABYLON.GUI.StackPanel();
    panel.spacing = 5;
    advancedTexture.addControl(panel);
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.paddingLeftInPixels = 10;
    panel.paddingTopInPixels = 10;
    panel.width = "30%";
    var hk = new BABYLON.HavokPlugin();
    scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), hk);
    var physicsEngine = scene.getPhysicsEngine();

    var viewer = new BABYLON.Debug.PhysicsViewer(scene);

    physicsMaterial = { friction: 0.2, restitution: 0.3 };
    bodyRenderingMaterial = new BABYLON.StandardMaterial("mat", scene);
    bodyRenderingMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.3, 1);
    bodyRenderingMaterial.ambientColor = new BABYLON.Color3(0.1, 0.1, 0.2);

    const viewerCheckbox = AddToggle("Debug Viewer", panel);
    viewerCheckbox.isChecked = true;
    viewerCheckbox.onIsCheckedChangedObservable.add((value) => {
        if (value) {
            viewer = new BABYLON.Debug.PhysicsViewer(scene);
            for (let mesh of scene.meshes) {
                if (mesh.physicsBody) {
                    viewer.showBody(mesh.physicsBody);
                }
            }
        } else {
            viewer.dispose();
            viewer = null;
        }
    });

    // body/shape on box
    BoxWorld(scene, new BABYLON.Vector3(0, 0, 0), 40, viewer, shadowGen);
    const instance = AddBody(
        scene,
        new BABYLON.Vector3(0, 10, 0),
        shadowGen,
        viewer
    );

    const addBtn = AddBtn("Add a body", panel, () => {
        const newBody = AddBody(
            scene,
            new BABYLON.Vector3(0, 10, 0),
            shadowGen,
            viewer
        );
    });

    return scene;
};

const AddBtn = function (text, panel, clickFn) {
    const addBtn = BABYLON.GUI.Button.CreateSimpleButton(
        "btn_" + text.slice(0, 5),
        text
    );
    panel.addControl(addBtn);
    addBtn.width = "100%";
    addBtn.height = "40px";
    addBtn.background = "green";
    addBtn.color = "white";
    addBtn.onPointerClickObservable.add(clickFn);
    return addBtn;
};

var AddToggle = function (toggleText, panel) {
    var toggleViewLine = new BABYLON.GUI.StackPanel("toggleViewLine");
    toggleViewLine.isVertical = false;
    toggleViewLine.horizontalAlignment =
        BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    toggleViewLine.spacing = 5;
    toggleViewLine.resizeToFit = true;
    toggleViewLine.height = "25px";
    panel.addControl(toggleViewLine);
    var checkbox = new BABYLON.GUI.Checkbox();
    checkbox.verticalAlignment = 0; //BABYLON.Control.VERTICAL_ALIGNMENT_TOP;
    checkbox.width = "20px";
    checkbox.height = "20px";
    checkbox.isChecked = false;
    checkbox.color = "green";
    toggleViewLine.addControl(checkbox);
    toggleViewLine.paddingTop = 2;

    var checkboxText = new BABYLON.GUI.TextBlock("checkboxText", toggleText);
    checkboxText.resizeToFit = true;
    checkboxText.color = "white";
    toggleViewLine.addControl(checkboxText);
    return checkbox;
};
