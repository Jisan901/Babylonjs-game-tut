export default class ActionButtonManager{
    constructor(container){
        this.container = container;
        this.buttons = {};
        this.State = {};
    }
    create(Action,size,position,side){
        let button = document.createElement('button');
        button.setAttribute('style',`
        position:fixed;
        ${side.x}:${position.x}px;
        ${side.y}:${position.y}px;
        border: 2px solid rgba(218, 225, 230, 0.25);
        height:${size}px;
        width:${size}px;
        border-radius:50%;
        background: radial-gradient(rgba(218, 225, 230, 0.25) 5%, rgba(218, 225, 230, 0.50) 95%);
        user-select: none;
        z-index:100;
        `)
        this.State[Action] = {
            current: false,
            target: button,
        }
        this.container.append(button)
        this.buttons[Action] = {button,Action}
        return this.buttons[Action];
    }
    _addHandler(dom,event,handler){
        dom.addEventListener(event, handler)
    }
    attachTouch(created, handler){
        this._addHandler(created.button ,'touchstart',()=>{
            this.State[created.Action].current = true;
            handler(true)
        })
        this._addHandler(created.button ,'touchend',()=>{
            this.State[created.Action].current = false;
            handler(false)
        })
    }
    attachClick(created, handler){
        this._addHandler(created.button ,'click',()=>{
            handler(true)
        })
    }
}