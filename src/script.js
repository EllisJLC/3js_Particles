import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const particleTexture = textureLoader.load('/textures/particles/2.png')

// Particles

// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)


// I tried
// const particlesGeometry = new THREE.BufferGeometry()
// const vertices = new Float32Array( [
//     Math.random() * 2, Math.random() * 2, Math.random() * 2,
//     Math.random() * 2, Math.random() * 2, Math.random() * 2,
//     Math.random() * 2, Math.random() * 2, Math.random() * 2,
//     Math.random() * 2, Math.random() * 2, Math.random() * 2,
//     Math.random() * 2, Math.random() * 2, Math.random() * 2,
// ])

// const indices = [
//     Math.random() * 3, Math.random() * 3, Math.random() * 3,
//     Math.random() * 3, Math.random() * 3, Math.random() * 3,
//     Math.random() * 3, Math.random() * 3, Math.random() * 3
// ]

// particlesGeometry.setIndex( indices )
// ParticlesGeometry.setAttribute('position', new THREE.BufferAttribute( vertices, 3))

// Solution
const particlesGeometry = new THREE.BufferGeometry()
const count = 20000

const positions = new Float32Array(count * 3) // specify number of coordinates
const colors = new Float32Array(count * 3) // colours are also created with 3 number arrays, for rgb

for (let i=0; i< count * 3; i++){
    positions[i] = Math.random() * 15 - 7.5
    colors[i] = Math.random() // each colour in rgb is represented by values 0-1
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3), // 3 = 3 values per vertex
)

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3), // 3 = 3 values per vertex
)

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1, // default 1
    sizeAttenuation: true, // default true
    color: "white",
    alphaMap: particleTexture,
    transparent : true
})

// Current material shows alpha 0, which still hides other textures, can be solved by the following methods.
// // alphaTest
// particlesMaterial.alphaTest = 0.001 // Uses a value between 0 and 1, closer to 0 hides pixels, but surrounding non-black pixels are still rendered

// // depth testing
// particlesMaterial.depthTest = false // can create bugs, like rendering particles behind other geometries, best to use with only particles of the same colour

// depth buffer
// webgl assesses positions of already-rendered objects, assesses particles behind a render to avoid rerendering certain pixels
particlesMaterial.depthWrite = false // very few bugs, usually works
particlesMaterial.blending = THREE.AdditiveBlending // adds colours together as they overlap
particlesMaterial.vertexColors = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // update particles
    particles.position.y = Math.sin(elapsedTime) // Animates in groups
    particles.position.x = Math.cos(elapsedTime)


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()