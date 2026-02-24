import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Environment {
    constructor(experience) {
        this.experience = experience
        this.scene = experience.scene
        this.planetRadius = 5
        this.objectsToCollide = []

        this.loader = new GLTFLoader()
        this.setTrees()
    }

    setTrees() {
        this.loader.load('/models/tree.glb', (gltf) => {
            const treeModel = gltf.scene

            for(let i = 0; i < 40; i++) {
                // Creiamo un contenitore (Group) per ogni albero
                // Questo ci permette di ruotare il modello dentro senza rompere la posizione sulla sfera
                const treeContainer = new THREE.Group()

                const tree = treeModel.clone()

                // --- 1. SISTEMIAMO L'ALLINEAMENTO ("DRITTI") ---
                // Se i tuoi alberi sono sdraiati, prova a de-commentare una di queste righe:
                // tree.rotation.x = Math.PI * 0.5 // Ruota di 90 gradi se sono stesi
                // tree.rotation.z = Math.PI * 0.5 
                
                // --- 2. REGOLIAMO LA GRANDEZZA ---
                // Dalla tua foto sembrano giganti, proviamo a rimpicciolirli
                tree.scale.set(1.5, 1.5, 1.5) 

                // --- 3. SISTEMIAMO I COLORI (TEXTURES/MATERIALI) ---
                tree.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true
                        
                        // Forza un colore verde (stile Abeto) e un materiale Toon
                        // Se invece vuoi le sue texture originali, cancella le 3 righe sotto
                        child.material = new THREE.MeshToonMaterial({
                            color: '#7fb069', // Verde oliva/pastello
                            gradientMap: null // Possiamo aggiungere ombre nette dopo
                        })
                    }
                })

                treeContainer.add(tree)

                // 4. POSIZIONAMENTO SULLA SFERA
                const phi = Math.acos(-1 + (2 * i) / 40)
                const theta = Math.sqrt(40 * Math.PI) * phi
                treeContainer.position.setFromSphericalCoords(this.planetRadius, phi, theta)

                // 5. ORIENTAMENTO (Piedi verso il centro)
                const up = treeContainer.position.clone().normalize()
                treeContainer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up)

                // Rotazione casuale sul proprio asse per non farli sembrare tutti uguali
                tree.rotation.y = Math.random() * Math.PI

                this.scene.add(treeContainer)

                // Aggiungiamo il container alla lista collisioni
                // Usiamo userData per dire quanto è grande l'ingombro
                treeContainer.userData.radius = 0.2 
                this.objectsToCollide.push(treeContainer)
            }
            console.log('Alberi sistemati!')
        })
    }
}