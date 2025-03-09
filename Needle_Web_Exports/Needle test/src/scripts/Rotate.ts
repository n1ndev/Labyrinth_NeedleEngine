import { Behaviour, serializable } from "@needle-tools/engine";

type axis = 'x' | 'y' | 'z'
export class Rotate extends Behaviour
{

    @serializable()
    speed : number = 3;

    @serializable()
    axis : axis = 'x'

    start(){
        // logging this is useful for debugging in the browser. 
        // You can open the developer console (F12) to see what data your component contains
        console.log(this);
    }

    // update will be called every frame
    update(){
        this.gameObject.rotateZ(this.context.time.deltaTime * this.speed);
        
    }
}
