import * as THREE from 'three'
import Controls from './Controls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Player {
    constructor(experience) {
        this.textureLoader = new THREE.TextureLoader()
        this.experience = experience
        this.scene = experience.scene
        this.planet = experience.planet
        this.controls = new Controls()

        this.planetRadius = 5.0
        this.heightAboveGround = 0.15
        this.moveSpeed = 0.015
        this.rotationSpeed = 0.08
        this.playerRadius = 0.2 

        this.container = new THREE.Group()
        this.scene.add(this.container)
        this.container.position.set(0, this.planetRadius + this.heightAboveGround, 0)

        // Ascoltatore per le emoji
        window.addEventListener('keydown', (event) => {
            if(['1', '2', '3'].includes(event.key)) {
                this.showEmoji(event.key)
            }
        })
        
        // --- CUBO DI EMERGENZA ---
        const tempGeometry = new THREE.BoxGeometry(0.2, 0.4, 0.2)
        const tempMaterial = new THREE.MeshStandardMaterial({ color: 'red' })
        this.placeholder = new THREE.Mesh(tempGeometry, tempMaterial)
        this.placeholder.position.y = 0.2
        this.container.add(this.placeholder)
        
        this.mesh = this.placeholder 

        this.setMesh()
    }

    setMesh() {
        const loader = new GLTFLoader()
        loader.load('/models/player.glb', (gltf) => {
            if(this.placeholder) {
                this.container.remove(this.placeholder)
            }
            this.mesh = gltf.scene
            this.mesh.scale.set(0.3, 0.3, 0.3) 
            this.mesh.position.y = 0 
            this.container.add(this.mesh)
            
            this.mesh.traverse((child) => {
                if (child.isMesh) child.castShadow = true
            })
        }, undefined, (error) => {
            console.warn('Modello non trovato.')
        })
    }

    update() {
        if (!this.mesh) return 

        const { forward, backward, left, right } = this.controls.keys
        const joy = this.controls.joystickInput
        const oldPosition = this.container.position.clone()

        // --- 1. ROTAZIONE (TASTIERA + JOYSTICK) ---
        let rotationAmount = 0
        if (left) rotationAmount += this.rotationSpeed
        if (right) rotationAmount -= this.rotationSpeed
        
        // Se il joystick è attivo, usiamo l'asse X per ruotare
        if (joy.active) {
            rotationAmount = -joy.x * this.rotationSpeed * 1.5
        }
        this.mesh.rotation.y += rotationAmount

        // --- 2. MOVIMENTO (TASTIERA + JOYSTICK) ---
        // Calcoliamo l'intensità: 1 (avanti), -1 (indietro) o valore analogico del joystick
        let moveIntensity = 0
        if (forward) moveIntensity = 1
        else if (backward) moveIntensity = -1
        else if (joy.active) moveIntensity = joy.y // y è già invertito in Controls.js

        // Se c'è input (usiamo una piccola deadzone di 0.1)
        if (Math.abs(moveIntensity) > 0.1) {
            const up = this.container.position.clone().normalize()
            
            // Direzione basata sul segno dell'intensità
            const direction = new THREE.Vector3(0, 0, moveIntensity > 0 ? 1 : -1)
            
            direction.applyQuaternion(this.mesh.quaternion)
            direction.applyQuaternion(this.container.quaternion)

            const axis = new THREE.Vector3().crossVectors(up, direction).normalize()
            
            // La velocità effettiva dipende da quanto si spinge il joystick
            const currentMoveSpeed = this.moveSpeed * Math.abs(moveIntensity)
            const angle = currentMoveSpeed / this.planetRadius
            const movementQuaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle)
            
            this.container.position.applyQuaternion(movementQuaternion)

            // --- CONTROLLO COLLISIONI ---
            let collisionDetected = false
            const obstacles = this.experience.environment.objectsToCollide
            
            for(const obstacle of obstacles) {
                const distance = this.container.position.distanceTo(obstacle.position)
                const obstacleRadius = obstacle.userData.radius || 0.2
                
                if(distance < (this.playerRadius + obstacleRadius)) {
                    collisionDetected = true
                    break
                }
            }

            if(collisionDetected) {
                this.container.position.copy(oldPosition)
            }
        }

        // --- 3. ALLINEAMENTO E NORMALIZZAZIONE ---
        const up = this.container.position.clone().normalize()
        const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up)
        this.container.quaternion.slerp(targetQuaternion, 0.1) 
        
        // Manteniamo il player appiccicato alla sfera
        this.container.position.normalize().multiplyScalar(this.planetRadius + this.heightAboveGround)
    }

    showEmoji(id) {
        if(this.emojiSprite) this.container.remove(this.emojiSprite)

        let emojiUrl = ''
        if(id === '1') emojiUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Smiling%20Eyes.png'
        if(id === '2') emojiUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Heart%20with%20Arrow.png'
        if(id === '3') emojiUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Victory%20Hand.png'

        const texture = this.textureLoader.load(emojiUrl)
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
        this.emojiSprite = new THREE.Sprite(material)

        this.emojiSprite.position.y = 1.3 
        this.emojiSprite.scale.set(0.4, 0.4, 0.4) 

        this.container.add(this.emojiSprite)

        setTimeout(() => {
            if(this.emojiSprite) {
                this.container.remove(this.emojiSprite)
                this.emojiSprite = null
            }
        }, 2000)
    }
}