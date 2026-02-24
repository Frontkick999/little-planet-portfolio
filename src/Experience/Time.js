export default class Time
{
    constructor()
    {
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        this.listeners = []

        this.tick()
    }

    onTick(callback)
    {
        this.listeners.push(callback)
    }

    tick()
    {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        // Chiamiamo tutti i listener
        this.listeners.forEach(listener => listener())

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }
}