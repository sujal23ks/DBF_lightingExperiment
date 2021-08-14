import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import { BoxGeometry, DirectionalLightShadow, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CSG } from 'three-csg-ts'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
    /**
     * Models
     */
const gltfLoader = new GLTFLoader()

gltfLoader.load(
    '/couch.glb',
    (gltf) => {
        console.log('Loaded GLTF is:: ', gltf)

        // for (const child of gltf.scene.children) {
        gltf.scene.position.set(3.5,-0.65, -4)
            scene.add(gltf.scene)
        // }



    }
)
gltfLoader.load(
    '/air2.glb',
    (gltf_2) => {
       // console.log('Loaded GLTF is:: ', gltf)

        gltf_2.scene.position.set(1.3,-0.65, 0)
            scene.add(gltf_2.scene)

            gltf_2.scene.traverse( function( node ) {

                if ( node.isMesh ) { node.castShadow = true; }
        
            } );

        
    }
)


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Environment map
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMap = cubeTextureLoader.load([
    '/textures/negx.jpg',
    '/textures/negz.jpg',
    '/textures/posy.jpg',
    '/textures/negy.jpg',
    '/textures/posz.jpg',
    '/textures/posx.jpg'
])

scene.background = environmentMap


const _visibleEdgeColor = '#ffffff'




/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 0.5
    //gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffd966, 0.4)
    //0xff9900
    //gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
directionalLight.position.set(9, 9.25, 0)

directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = -3;
directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.camera.top = 200;
directionalLight.shadow.camera.bottom = -9;
// directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 10;
// directionalLight.shadow.radius = 15;

console.log(directionalLight.shadow)
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffa500, 0.3) //0xff0000,0x0000ff
scene.add(hemisphereLight)

// Point light
const pointLight = new THREE.PointLight(0xff9000, 0.4, 10, 2)
pointLight.position.set(2, 1.5, -0.5)
scene.add(pointLight)

const pointLight_2 = new THREE.PointLight(0xff9000, 0.3, 10, 2)
pointLight_2.position.set(7, 1.5, 1)
scene.add(pointLight_2)

const pointLight_3 = pointLight_2.clone()
pointLight_3.position.z = -1
scene.add(pointLight_3)

const pointLight_4 = pointLight_2.clone()
pointLight_4.position.z = -3
scene.add(pointLight_4)

const pointLight_5 = pointLight_2.clone()
pointLight_5.position.z = -6
scene.add(pointLight_5)


// Rect area light
const rectAreaLight = new THREE.RectAreaLight(0xffffff, 0.074, 10, 10) //FFEC00,0x4e00ff
rectAreaLight.position.set(2.5, 2.345, -2.5)
rectAreaLight.lookAt(new THREE.Vector3())
gui.add(rectAreaLight, 'intensity').min(0).max(1).step(0.001)
rectAreaLight.rotation.set(-Math.PI * 0.5, 0, Math.PI * 0.5)

scene.add(rectAreaLight)

// Spot light
const spotLight = new THREE.SpotLight(0xffff00, 0.7, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(-1, 7, 0)
scene.add(spotLight)

const spotLight_2 = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)

//spotLight.position.set(5, 4, 3)

//spotLight_2.target.position.x=0;
//spotLight_2.target.position.y=3;
//spotLight_2.target.position.y=6;


//spotLight_2.target=(0, 3, 6)
//scene.add(spotLight_2)
//scene.add(spotLight_2.target)


// Helpers
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
// scene.add(hemisphereLightHelper)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)

// const pointLightHelper = new THREE.PointLightHelper(pointLight_2, 0.2)
// scene.add(pointLightHelper)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight_2)
// scene.add(spotLightHelper)
// window.requestAnimationFrame(() => {
//     spotLightHelper.update()
// })

// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
// scene.add(rectAreaLightHelper)

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
    console.log('onStart')
}

loadingManager.onLoad = () => {
    console.log('loading finished')
}
loadingManager.onProgress = () => {
    console.log('loading progressing')
}
loadingManager.onError = () => {
    console.log('loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load(
    '/textures/floor.jpg',
)

const colorTexture_wall = textureLoader.load(
    '/textures/wall_brick.jpg',
)

const wall_col = textureLoader.load(
    '/textures/wall.jpg'
)
const wall_colao = textureLoader.load(
    '/textures/wallAmbientOcclusion3.jpg'
)

const wall_colao2 = textureLoader.load(
        '/textures/wallAmbientOcclusion.jpg'
    )
    /**
     * Objects
     */
    // Material

const material_Floor = new THREE.MeshStandardMaterial({ map: colorTexture })
material_Floor.roughness = 0.5
material_Floor.aoMap = wall_colao2;


const material = new THREE.MeshStandardMaterial()
material.map = wall_col;
material.aoMap = wall_colao;
//material.color.set(0xcccccc)
material.roughness = 0.4


const material_glass = new THREE.MeshStandardMaterial()
material_glass.color.set(0xacf9e5)
material_glass.roughness = 0.4
material_glass.transparent = true
material_glass.opacity = 0.3


// //TO CREATE Cartoonish Style
// const material = new THREE.MeshToonMaterial()
// material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const cube_2 = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.75, 0.75),
    material
)

const result = CSG.subtract(sphere, cube_2)

result.position.x = -1
scene.add(result)

sphere.position.x = -1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)
cube.castShadow = true
const wall_1 = new THREE.Mesh(
    new THREE.BoxGeometry(.23, 3, 5),
    material
)

const wall_3 = new THREE.Mesh(
    new THREE.BoxGeometry(.23, 3, 4.8),
    material
)

const wall_full = new THREE.Mesh(
    new THREE.BoxGeometry(.23, 3, 10),
    material
)

const wall_window = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2.2, 4),
    material
)
const wall_window_tex = new THREE.Mesh(
    new THREE.BoxGeometry(.01, 2.2, 4),
    material_glass
)

const wall_5 = CSG.subtract(wall_full, wall_window)

wall_5.position.y = 0.85;
wall_5.position.z = -2.5;
wall_5.position.x = 7.4;

wall_window_tex.position.y = 0.85;
wall_window_tex.position.z = -2.5;
wall_window_tex.position.x = 7.4;


scene.add(wall_window_tex)

wall_1.position.y = 0.85;
wall_1.castShadow = true
wall_1.receiveShadow=true
wall_5.castShadow = true

const wall_2 = wall_1.clone();

wall_1.position.x = 2.5;
wall_2.position.x = -2.5;
wall_1.scale.z = 0.5

wall_3.position.y = 0.85;
wall_3.rotation.y = -Math.PI * 0.5;

const wall_4 = new THREE.Mesh(
    new THREE.BoxGeometry(9.7, 3, .23),
    material
)

wall_3.position.z = -2.385;
wall_4.position.z = 2.385;
wall_4.position.y = .85;
wall_4.position.x = 2.45;

const wall_6 = wall_3.clone();
wall_6.position.z = -7.385;
wall_6.position.x = 4.9;

const wall_7 = wall_2.clone();
wall_7.position.z = -4.27;
wall_7.position.x = wall_1.position.x;
wall_7.scale.z = 0.8;

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material_Floor
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65


const plane_2 = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 10),
    material_Floor
)
plane_2.rotation.x = -Math.PI * 0.5
plane_2.position.y = -0.65
plane_2.position.x = 5;
plane_2.position.z = -2.5;


plane.receiveShadow = true
plane_2.receiveShadow = true


wall_1.geometry.setAttribute('uv2', new THREE.BufferAttribute(wall_1.geometry.attributes.uv.array, 2))
wall_2.geometry.setAttribute('uv2', new THREE.BufferAttribute(wall_2.geometry.attributes.uv.array, 2))
wall_3.geometry.setAttribute('uv2', new THREE.BufferAttribute(wall_3.geometry.attributes.uv.array, 2))
wall_4.geometry.setAttribute('uv2', new THREE.BufferAttribute(wall_4.geometry.attributes.uv.array, 2))
wall_5.geometry.setAttribute('uv2', new THREE.BufferAttribute(wall_5.geometry.attributes.uv.array, 2))
wall_6.geometry.setAttribute('uv2', new THREE.BufferAttribute(wall_6.geometry.attributes.uv.array, 2))
wall_7.geometry.setAttribute('uv2', new THREE.BufferAttribute(wall_7.geometry.attributes.uv.array, 2))
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
plane_2.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane_2.geometry.attributes.uv.array, 2))


scene.add(cube, torus, plane, plane_2, wall_1, wall_2, wall_3, wall_4, wall_5, wall_6, wall_7)


// const geometry = new THREE.BoxGeometry(100, 100, 100);
const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(.23, 3, 5));
const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 0.8 }));
//scene.add(line);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
})

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1

})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -5
camera.position.y = 8
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true
    //renderer.physicallyCorrectLights = true
/**
 * Post Processing
 */
const effectComposer=new EffectComposer(renderer)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width,sizes.height)

const renderPass=new RenderPass(scene,camera)
effectComposer.addPass(renderPass)


const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight),scene, camera)


outlinePass.visibleEdgeColor=_visibleEdgeColor
outlinePass.edgeThickness=3
outlinePass.edgeGlow=0.5


effectComposer.addPass(outlinePass);


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    raycaster.setFromCamera(mouse, camera)
    const objectsToTest = [wall_1]

    const intersects = raycaster.intersectObjects(objectsToTest)

    for (const object of objectsToTest) {
        object.material.color.set('#cccccc')
    }
    for (const intersect of intersects) {

//outlinePass.intersect=intersects
       intersect.object.material.color.set('#0000ff')
    }
    //console.log(intersects)


    // Update controls
    controls.update()

    // Render
   // renderer.render(scene, camera)
   effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()