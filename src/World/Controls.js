import nipplejs from 'nipplejs'

export default class Controls {
    constructor() {
        this.keys = { forward: false, backward: false, left: false, right: false }
        this.joystickInput = { x: 0, y: 0, active: false }
        
        // Rilevamento touch
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

        window.addEventListener('keydown', (e) => this.onKeyDown(e))
        window.addEventListener('keyup', (e) => this.onKeyUp(e))

        if (this.isTouch) {
            this.createJoystick()
        }
    }

    createJoystick() {
        const options = {
            zone: document.getElementById('joystick-zone'),
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'white',
            size: 100
        }

        this.joystick = nipplejs.create(options)

        this.joystick.on('move', (evt, data) => {
            this.joystickInput.active = true
            // data.vector.y è negativo quando spingi su, lo invertiamo per comodità
            this.joystickInput.x = data.vector.x
            this.joystickInput.y = data.vector.y 
        })

        this.joystick.on('end', () => {
            this.joystickInput.active = false
            this.joystickInput.x = 0
            this.joystickInput.y = 0
        })
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