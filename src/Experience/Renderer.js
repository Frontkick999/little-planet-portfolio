import * as THREE from 'three'

export default class Renderer
{
    constructor(experience)
    {
        this.experience = experience
        this.sizes = experience.sizes
        this.scene = experience.scene
        this.camera = experience.camera

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            antialias: true
        })

        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)

        document.body.appendChild(this.instance.domElement)
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }

    resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
}
}