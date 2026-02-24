import * as THREE from 'three'

export default class Planet
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = experience.scene

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        // Raggio 1.5, segmenti abbastanza alti per essere morbido
        this.geometry = new THREE.SphereGeometry(5, 64, 64)
    }

 setMaterial() {
    this.material = new THREE.MeshToonMaterial({ 
        color: '#91f086' // Un bel verde prato
    })
}

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }
}