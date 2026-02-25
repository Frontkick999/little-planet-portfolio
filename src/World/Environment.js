import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Environment {
    constructor(experience) {
        this.experience = experience
        this.scene = experience.scene
        this.planetRadius = 5
        this.objectsToCollide = []

        // Definiamo il punto di spawn del giocatore (solitamente 0, 5, 0)
        this.playerSpawnPoint = new THREE.Vector3(0, this.planetRadius, 0)
        this.safeZoneRadius = 2 // Raggio dell'area senza ostacoli attorno al giocatore

        this.loader = new GLTFLoader()
        
        this.setTrees()
        this.setRocks()
    }

    setTrees() {
        this.loader.load('/models/tree.glb', (gltf) => {
            const treeModel = gltf.scene
            
            // --- IMPOSTATO A 30 ALBERI ---
            const totalTrees = 30 

            treeModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true
                    const originalTexture = child.material.map
                    if(originalTexture) originalTexture.flipY = false
                    child.material = new THREE.MeshToonMaterial({
                        map: originalTexture,
                        color: originalTexture ? null : '#7fb069',
                        gradientMap: null
                    })
                }
            })

            for(let i = 0; i < totalTrees; i++) {
                const treeContainer = new THREE.Group()
                
                // La formula usa totalTrees per distribuirli equamente
                const phi = Math.acos(-1 + (2 * i) / totalTrees)
                const theta = Math.sqrt(totalTrees * Math.PI) * phi
                const pos = new THREE.Vector3().setFromSphericalCoords(this.planetRadius, phi, theta)

                // --- CONTROLLO SAFE ZONE ---
                if (pos.distanceTo(this.playerSpawnPoint) < this.safeZoneRadius) {
                    continue 
                }

                const tree = treeModel.clone()
                tree.scale.set(1.5, 1.5, 1.5) 
                treeContainer.add(tree)
                treeContainer.position.copy(pos)

                const up = treeContainer.position.clone().normalize()
                treeContainer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up)
                tree.rotation.y = Math.random() * Math.PI

                this.scene.add(treeContainer)
                treeContainer.userData.radius = 0.2 
                this.objectsToCollide.push(treeContainer)
            }
            console.log(`Alberi sistemati: ${totalTrees}`)
        })
    }

    setRocks() {
        this.loader.load('/models/rocks.glb', (gltf) => {
            const rockModel = gltf.scene

            let spawnedRocks = 0
            let attempts = 0

            while(spawnedRocks < 15 && attempts < 100) {
                attempts++
                const rockContainer = new THREE.Group()
                
                const phi = Math.random() * Math.PI * 2
                const theta = Math.random() * Math.PI
                const pos = new THREE.Vector3().setFromSphericalCoords(this.planetRadius, theta, phi)

                if (pos.distanceTo(this.playerSpawnPoint) < this.safeZoneRadius) {
                    continue 
                }

                const rock = rockModel.clone()
                const s = 1.2 + Math.random() * 1.3
                rock.scale.set(s, s, s)

                rock.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true
                        const originalTexture = child.material.map
                        if(originalTexture) originalTexture.flipY = false
                        child.material = new THREE.MeshToonMaterial({
                            map: originalTexture,
                            color: originalTexture ? null : '#888888',
                            gradientMap: null
                        })
                    }
                })

                rockContainer.add(rock)
                rockContainer.position.copy(pos)

                const up = rockContainer.position.clone().normalize()
                rockContainer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up)
                rock.rotation.y = Math.random() * Math.PI

                this.scene.add(rockContainer)
                rockContainer.userData.radius = 0.1 * s 
                this.objectsToCollide.push(rockContainer)
                
                spawnedRocks++
            }
            console.log(`Rocce sistemate!`)
        })
    }
}