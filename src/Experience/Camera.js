import * as THREE from 'three'

export default class Camera
{
    constructor(experience)
    {
        this.experience = experience
        this.sizes = experience.sizes
        this.scene = experience.scene
        
        this.targetPosition = new THREE.Vector3()
        this.currentPosition = new THREE.Vector3()

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(
            85, // Aumentato a 85 per un effetto più "grandangolo"
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )
        
        this.instance.position.set(0, 2, 2)
        this.scene.add(this.instance)
    }

    update()
    {
        const player = this.experience.player
        if(!player || !player.container) return

        const playerPosition = player.container.position.clone()
        const upVector = playerPosition.clone().normalize()

        const forwardDirection = new THREE.Vector3(0, 0, 1)
        forwardDirection.applyQuaternion(player.mesh.quaternion)
        forwardDirection.applyQuaternion(player.container.quaternion)

        // --- VALORI PER LO ZOOM TIPO ABETO ---
        const distanceBack = 1.8 // Molto più vicino (prima era 6)
        const heightUp = 0.6    // Molto più basso, quasi alle spalle (prima era 3)

        const targetPos = playerPosition.clone()
            .add(upVector.clone().multiplyScalar(heightUp))
            .sub(forwardDirection.clone().multiplyScalar(distanceBack))

        // Movimento camera (più è basso lo 0.1, più la camera è "pigra" e fluida)
        this.currentPosition.lerp(targetPos, 0.1)
        this.instance.position.copy(this.currentPosition)

        // Facciamo guardare la camera un po' sopra la testa del player
        // così il player non è perfettamente al centro ma un po' più in basso
        const lookAtTarget = playerPosition.clone().add(upVector.clone().multiplyScalar(0.4))
        this.instance.lookAt(lookAtTarget)

        this.instance.up.copy(upVector)
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
}