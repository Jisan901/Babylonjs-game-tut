/**
 * Utility function for calculating the offset of an element relative to the document.
 * @param {HTMLElement} el - The HTML element for which to calculate the offset.
 * @returns {{top: number, left: number}} - The offset of the element relative to the document.
 */
function getOffset(el) {
    // returns the offset of an element relative to the document
    const rect = el.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    }
}


/**
 * Represents a movement pad user interface element.
 */
class MovementPad {
    container
    padElement
    region
    handle
    eventRepeatTimeout
    regionData = {}
    handleData = {}
    mouseDown = false
    mouseStopped = false

    constructor(container,canvas) {
        this.container = container;
        this.padElement = document.createElement('div')
        this.padElement.classList.add('movement-pad')
        this.region = document.createElement('div')
        this.region.classList.add('region')
        this.handle = document.createElement('div')
        this.handle.classList.add('handle')
        this.region.appendChild(this.handle)
        this.padElement.append(this.region)
        this.container.append(this.padElement)

        // Aligning pad:
        
        this.alignAndConfigPad(canvas)

        // events
        window.addEventListener('resize', () => {this.alignAndConfigPad(canvas)})

        // Mouse events:
        this.region.addEventListener('mousedown', (event) => {
            this.mouseDown = true
            this.handle.style.opacity = 1.0
            this.update(event.pageX, event.pageY)
        })

        document.addEventListener('mouseup', () => {
            this.mouseDown = false
            this.resetHandlePosition()
        })

        document.addEventListener('mousemove', (event) => {
            if (!this.mouseDown)
                return
            this.update(event.pageX, event.pageY)
        })

        //Touch events:
        this.region.addEventListener('touchstart', (event) => {
            this.mouseDown = true
            this.handle.style.opacity = 1.0
            this.update(
                event.targetTouches[0].pageX,
                event.targetTouches[0].pageY
            )
        })

        let touchEnd = () => {
            this.mouseDown = false
            this.resetHandlePosition()
        }
        this.region.addEventListener('touchend', touchEnd)
        this.region.addEventListener('touchcancel', touchEnd)

        this.region.addEventListener('touchmove', (event) => {
            event.stopPropagation()
            if (!this.mouseDown)
                return
            this.update(event.targetTouches[0].pageX, event.targetTouches[0].pageY)
        })

        this.resetHandlePosition()
    }

    alignAndConfigPad(canvas) {
        // this.padElement.style.top = canvas.height + this.container.getBoundingClientRect().top
        //                             - this.region.offsetHeight - 20 + 'px'
        // this.padElement.style.left = '20px'

        this.regionData.width = this.region.offsetWidth
        this.regionData.height = this.region.offsetHeight
        this.regionData.position = {
            top: this.region.offsetTop,
            left: this.region.offsetLeft
        }
        this.regionData.offset = getOffset(this.region)
        this.regionData.radius = this.regionData.width / 2
        this.regionData.centerX = this.regionData.position.left + this.regionData.radius
        this.regionData.centerY = this.regionData.position.top + this.regionData.radius

        this.handleData.width = this.handle.offsetWidth
        this.handleData.height = this.handle.offsetHeight
        this.handleData.radius = this.handleData.width / 2

        this.regionData.radius = this.regionData.width / 2 - this.handleData.radius
    }

    update(pageX, pageY) {
        let newLeft = (pageX - this.regionData.offset.left)
        let newTop = (pageY - this.regionData.offset.top)

        // If handle reaches the pad boundaries.
        let distance = Math.pow(this.regionData.centerX - newLeft, 2) + Math.pow(this.regionData.centerY - newTop, 2)
        if (distance > Math.pow(this.regionData.radius, 2)) {
            let angle = Math.atan2((newTop - this.regionData.centerY), (newLeft - this.regionData.centerX))
            newLeft = (Math.cos(angle) * this.regionData.radius) + this.regionData.centerX
            newTop = (Math.sin(angle) * this.regionData.radius) + this.regionData.centerY
        }
        newTop = Math.round(newTop * 10) / 10
        newLeft = Math.round(newLeft * 10) / 10

        this.handle.style.top = newTop - this.handleData.radius + 'px'
        this.handle.style.left = newLeft - this.handleData.radius + 'px'
        // console.log(newTop , newLeft)

        // event and data for handling camera movement
        let deltaX = this.regionData.centerX - parseInt(newLeft)
        let deltaY = this.regionData.centerY - parseInt(newTop)
        // Normalize x,y between -2 to 2 range.
        deltaX = -2 + (2 + 2) * (deltaX - (-this.regionData.radius)) / (this.regionData.radius - (-this.regionData.radius))
        deltaY = -2 + (2 + 2) * (deltaY - (-this.regionData.radius)) / (this.regionData.radius - (-this.regionData.radius))
        deltaX = Math.round(deltaX * 10) / 10
        deltaY = Math.round(deltaY * 10) / 10
        // console.log(deltaX, deltaY)
        this.sendEvent(deltaX, deltaY, 0)
    }

    sendEvent(dx, dy, middle) {
        
        if (this.eventRepeatTimeout) {
            clearTimeout(this.eventRepeatTimeout)
        }

        if (!this.mouseDown) {
            const stopEvent = new Event('stopMove', {bubbles: false})
            this.padElement.dispatchEvent(stopEvent)
            return
        }

        this.eventRepeatTimeout = setTimeout(() => {
            this.sendEvent(dx, dy, middle)
        }, 5)

        let moveEvent = new CustomEvent('move', {
            bubbles: false,
            detail:{
                'deltaX': dx,
                'deltaY': dy,
                'middle': middle
            }
        })
        this.padElement.dispatchEvent(moveEvent)
    }

    resetHandlePosition() {
        this.handle.style.top = this.regionData.centerY - this.handleData.radius + 'px'
        this.handle.style.left = this.regionData.centerX - this.handleData.radius + 'px'
        this.handle.style.opacity = 0.1
        // this.handle.animate({
        //     top: this.regionData.centerY - this.handleData.radius,
        //     left: this.regionData.centerX - this.handleData.radius,
        //     opacity: 0.1
        // }, "fast")
    }
}


export default MovementPad



/**
 * Represents a velocity calculator for player movement.
 */
class _VelocityCalculator{
    /**
     * Creates an instance of VelocityCalculator.
     */
    constructor(){
        this.delta = 0.75; // :)
        this.moveSpeed = 0.5;
        this.velocity = {
            x:0,
            y:0,
            z:0
        }
    }
    /**
     * Updates the velocity based on input.
     * @param {_InputState} input - The input state from the player.
     */
    update(input){
        this.velocity.x += (-1 * this.velocity.x) * this.delta
        this.velocity.z += (-1 * this.velocity.z) * this.delta

        if (input.State.moveForward) {
            this.velocity.z -= input.ztouch * this.moveSpeed * this.delta
        }
        if (input.State.moveBackward) {
            this.velocity.z += input.ztouch * this.moveSpeed * this.delta
        }
        if (input.State.moveLeft){
            this.velocity.x -= input.xtouch * this.moveSpeed * this.delta
        }
        if (input.State.moveRight){
            this.velocity.x += input.xtouch * this.moveSpeed * this.delta
        }
    }
    resetToZero(){
        this.velocity = {
            x:0,
            y:0,
            z:0
        }
    }
}



/**
 * Creates an instance of InputState.
 * @param {MovementPad} controls - The movement pad controls.
 */
class _InputState{
    constructor(controls){
        this.controls = controls;
        this.ztouch;
        this.xtouch;
        this.onTrySetState = null;
        this.onAfterTrySetState = null;
        this.onend = null;
        this.State = {
            moveForward : false,
            moveBackward : false,
            moveLeft : false,
            moveRight : false
        }
        this.movementPad = this.controls;
        
        this.movementPad.padElement.addEventListener('move', (event) => {
            this.onTrySetState && this.onTrySetState(this.State);
            this.ztouch = Math.abs(event.detail.deltaY)
            this.xtouch = Math.abs(event.detail.deltaX)

            if (event.detail.deltaY == event.detail.middle) {
                this.ztouch = 1
                this.State.moveForward = this.State.moveBackward = false
            } else {
                if (event.detail.deltaY > event.detail.middle) {
                    this.State.moveForward = true;
                    this.State.moveBackward = false;
                }
                else if (event.detail.deltaY < event.detail.middle) {
                    this.State.moveForward = false;
                    this.State.moveBackward = true;
                }
            }

            if (event.detail.deltaX == event.detail.middle) {
                this.xtouch = 1
                this.State.moveRight = this.State.moveLeft = false
            } else {
                if (event.detail.deltaX < event.detail.middle) {
                    this.State.moveRight = true
                    this.State.moveLeft = false
                }
                else if (event.detail.deltaX > event.detail.middle) {
                    this.State.moveRight = false
                    this.State.moveLeft = true
                }
            }
            this.onAfterTrySetState && this.onAfterTrySetState(this.State);
        })
        this.movementPad.padElement.addEventListener('stopMove', (event) => {
            this.onend && this.onend(this.State)
            this.ztouch = this.xtouch = 1
            this.State.moveForward = this.State.moveBackward = this.State.moveLeft = this.State.moveRight = false
        })
    }
}

export {_InputState, _VelocityCalculator};