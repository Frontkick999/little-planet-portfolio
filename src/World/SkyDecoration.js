import * as THREE from 'three'

export default class SkyDecoration {
    constructor(experience) {
        this.scene = experience.scene
        this.count = 15 // Meno nuvole, ma più belle
        this.group = new THREE.Group()
        this.scene.add(this.group)
        
        this.setClouds()
    }

    setClouds() {
        // Usiamo un cerchio con molti segmenti per farlo sembrare tondo
        const geometry = new THREE.CircleGeometry(1, 32)
        
        // Materiale bianco, molto trasparente e che ignora la nebbia
        const material = new THREE.MeshBasicMaterial({ 
            color: '#ffffff', 
            transparent: true, 
            opacity: 0.4,
            fog: false,
            side: THREE.DoubleSide
        })

        for(let i = 0; i < this.count; i++) {
            // Ogni nuvola è un gruppo di 3-4 cerchi
            const cloudGroup = new THREE.Group()

            // Creiamo il "blob" della nuvola
            const numBlobs = 3 + Math.floor(Math.random() * 2)
            for(let j = 0; j < numBlobs; j++) {
                const blob = new THREE.Mesh(geometry, material)
                
                // Posizioniamo i cerchi vicini tra loro per formare una nuvola
                blob.position.x = j * 0.8
                blob.position.y = (Math.random() - 0.5) * 0.5
                
                // Schiacciamo i cerchi per farli sembrare piatti (Vibe Abeto)
                const scale = 1 + Math.random() * 2
                blob.scale.set(scale, scale * 0.6, 1)
                
                cloudGroup.add(blob)
            }

            // Posizioniamo l'intero gruppo nel cielo
            const dist = 35 + Math.random() * 5
            const phi = Math.random() * Math.PI * 0.5 // Solo nella metà superiore del cielo
            const theta = Math.random() * Math.PI * 2
            
            cloudGroup.position.setFromSphericalCoords(dist, phi, theta)
            
            // Fondamentale: le nuvole devono guardare il centro del pianeta
            cloudGroup.lookAt(0, 0, 0)
            
            this.group.add(cloudGroup)
        }
    }

    update() {
        // Rotazione molto lenta del cielo
        this.group.rotation.y += 0.0002
    }
}