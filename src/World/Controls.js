export default class Controls {
    constructor() {
        this.keys = { forward: false, backward: false, left: false, right: false }
        
        window.addEventListener('keydown', (e) => this.onKeyDown(e))
        window.addEventListener('keyup', (e) => this.onKeyUp(e))
    }

    onKeyDown(e) {
        if(e.key === 'w' || e.key === 'ArrowUp') this.keys.forward = true
        if(e.key === 's' || e.key === 'ArrowDown') this.keys.backward = true
        if(e.key === 'a' || e.key === 'ArrowLeft') this.keys.left = true
        if(e.key === 'd' || e.key === 'ArrowRight') this.keys.right = true
    }

    onKeyUp(e) {
        if(e.key === 'w' || e.key === 'ArrowUp') this.keys.forward = false
        if(e.key === 's' || e.key === 'ArrowDown') this.keys.backward = false
        if(e.key === 'a' || e.key === 'ArrowLeft') this.keys.left = false
        if(e.key === 'd' || e.key === 'ArrowRight') this.keys.right = false
    }
}