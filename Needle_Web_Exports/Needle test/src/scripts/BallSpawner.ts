import { AssetReference, Behaviour, GameObject, Input, InstantiateOptions, Mathf, serializable } from "@needle-tools/engine";
import { Euler, Object3D, Quaternion } from "three";

export class BallSpawner extends Behaviour
{
    
    // input: Input | undefined = this.context.input;
    // let input : Input = this.context.input;
    
    @serializable(GameObject)
    ballGameObject?: GameObject;
    @serializable(AssetReference)
    ballPrefab?: AssetReference;
    
    // myInstance?: GameObject;

    async start() {
   
      
    } 
    update(): void {
        if(this.context.input.getPointerDown(0)){
            console.log("POINTER DOWN");
            const euler : Euler = new Euler(0,Mathf.random(0,360),0);
            const opts = new InstantiateOptions() 
            {
                opts.position = this.worldPosition
                const q : Quaternion = new Quaternion();
                q.setFromEuler(euler);
                opts.rotation?.setFromEuler(euler);
            }
            
            // const ballGOInstance = GameObject.instantiate(this.ballGameObject!, opts);
             this.ballPrefab?.instantiate(opts);
        }
}
}
