import * as THREE from 'three'
import Sizes from './Sizes.js'
import Time from './Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Planet from '../World/Planet.js'
import Player from '../World/Player.js'
import Environment from '../World/Environment.js'
import SkyDecoration from '../World/SkyDecoration.js'

export default class Experience
{
 constructor()
{
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()

    // 1. Imposta lo sfondo azzurro e la nebbia
    const skyColor = '#d1eefc'
    this.scene.background = new THREE.Color(skyColor)
    this.scene.fog = new THREE.Fog(skyColor, 10, 50)

    this.camera = new Camera(this)
    this.renderer = new Renderer(this)
    this.planet = new Planet(this)
    this.player = new Player(this)
    this.environment = new Environment(this)

    // --- AGGIUNGI QUESTE DUE RIGHE ---
    this.setSky()                      // <--- Crea la cupola del cielo
    this.skyDeco = new SkyDecoration(this) // <--- Crea le nuvole
    // ---------------------------------

    this.setLights()

    window.addEventListener('resize-detected', () => {
        this.resize()
    })

    this.time.onTick(() => {
        this.update()
    })
}

setSky() {
    // Creiamo una sfera enorme che avvolge tutto (raggio 50)
    const skyGeometry = new THREE.SphereGeometry(50, 32, 32)
    const skyMaterial = new THREE.MeshBasicMaterial({
        color: '#d1eefc', 
        side: THREE.BackSide, // Importante: vediamo l'interno della sfera
        fog: false            // Il cielo non deve sparire con la nebbia
    })

    const sky = new THREE.Mesh(skyGeometry, skyMaterial)
    this.scene.add(sky)
}

resize() {
    this.camera.resize()
    this.renderer.resize()
}

    update()
    {
        this.player.update()
        this.camera.update()
        this.renderer.update()

        if(this.skyDeco) this.skyDeco.update() 
    }

    setLights() 
{
    // 1. Luce Ambientale: illumina tutto un pochino, così non ci sono ombre troppo nere
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.8)
    this.scene.add(ambientLight)

    // 2. Luce Direzionale: come se fosse il Sole. Crea i riflessi e dà profondità
    const sunLight = new THREE.DirectionalLight('#ffffff', 1.2)
    sunLight.position.set(5, 5, 5) // La mettiamo in alto a lato
    this.scene.add(sunLight)
}
}