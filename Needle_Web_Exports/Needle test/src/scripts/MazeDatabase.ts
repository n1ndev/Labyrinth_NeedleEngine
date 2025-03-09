
import { AssetReference, Behaviour, GameObject, Input, InstantiateOptions, instantiate, serializable } from "@needle-tools/engine";
import { Maze, MazeElementLayout, MazeBooleanLayout } from "../MazeData";

let mazeLayout : MazeElementLayout =
{
    mazeSize: 10,
    wallElements : [
        {position:  0, variant: null}, 
        {position:  1, variant: null},
        // {position:  2, variant: null},
        // {position:  3, variant: null},
        // {position:  4, variant: null},
        // // {position:  5, variant: null},
        // {position:  6, variant: null},
        // // {position:  7, variant: null},
        // // {position:  8, variant: null},
        // {position:  9, variant: null}
    ],
        
    innerBarrierElements : [
        // {position: 0, variant: null}, 
        // {position: 1, variant: null}, 
        // {position: 2, variant: null}, 
        // {position: 3, variant: null}, 
        // {position: 4, variant: null},
        // {position: 5, variant: null},
        // {position: 6, variant: null},
        // {position: 7, variant: null},
        // {position: 8, variant: null},
        // {position: 9, variant: null},
    ],

    outerBarrierElements:[
        {position: 0, variant:null},
        {position: 1, variant:null},
        {position: 2, variant:null},
        // {position: 3, variant:null},
        // {position: 4, variant:null},
        // {position: 5, variant:null},
        {position: 6, variant:null},
        // {position: 7, variant:null},
        // {position: 8, variant:null},
        // {position: 9, variant:null},
    ],
    centreWallElement :
    {
        position: 7, variant:null
    }

};
let mazeBooleanLayout : MazeBooleanLayout = [
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true],   
    [true, true, true, true, true, true, true, true, true, true]  
]

let mazeBooleanLayout2 : MazeBooleanLayout = [
    [false, false, false, true, true, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],   
    [false, false, false, false, false, false, false, false, false, false]  
]
export class MazeDatabase extends Behaviour { 


    @serializable()
    mazeDataValues : string = '';
    public maze! : Maze;
    
    
    awake(): void {
        this.maze = new Maze(mazeBooleanLayout2);
    }
    start(){
        
    }

}
