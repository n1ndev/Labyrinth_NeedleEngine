import { Euler, Quaternion, Vector3 } from "three";
import { BarrierElement, CentreWallElement, Maze, MazeElementLayout, MazeElement, OuterBarrierElement, WallElement } from "../MazeData";
import { MazeElementProfile } from "./MazeElementProfile";
import { AssetReference, Behaviour, GameObject, Input, InstantiateOptions, instantiate, serializable } from "@needle-tools/engine";
import { MazeDatabase } from "./MazeDatabase";
import { Rotate } from "./Rotate";

// let mazeData : MazeData =
// {
//     mazeSize: 10,
//     wallElements : [
//         // {position:  0, variant: null}, 
//         // {position:  1, variant: null},
//         // {position:  2, variant: null},
//         {position:  2, variant: null},
//         {position:  4, variant: null},
//         // {position:  5, variant: null},
//         {position:  6, variant: null},
//         // {position:  7, variant: null},
//         // {position:  8, variant: null},
//         {position:  9, variant: null}
//     ],
        
//     innerBarrierElements : [
//         // {position: 0, variant: null}, 
//         {position: 1, variant: null}, 
//         // {position: 2, variant: null}, 
//         // {position: 3, variant: null}, 
//         // {position: 4, variant: null},
//         {position: 5, variant: null},
//         // {position: 6, variant: null},
//         {position: 7, variant: null},
//         // {position: 8, variant: null},
//         // {position: 9, variant: null},
//     ],

//     outerBarrierElements:[
//         {position: 0, variant:null},
//         {position: 1, variant:null},
//         {position: 2, variant:null},
//         // {position: 3, variant:null},
//         // {position: 4, variant:null},
//         // {position: 5, variant:null},
//         {position: 6, variant:null},
//         // {position: 7, variant:null},
//         // {position: 8, variant:null},
//         // {position: 9, variant:null},
//     ],
//     centreWallElement :
//     {
//         position: 7, variant:null
//     }

// };


// let maze = new Maze(mazeData)

export class MazeRenderer extends Behaviour {
    
    @serializable(MazeDatabase)
    mazeDatabase!: MazeDatabase;   
    
    
    async awake()
    {
        this.mazeDatabase.maze.subscribeToElementAdded(this.InstantiateRequestedMazeElement.bind(this));
    }
    
   //#region - Maze element Prefabs
   
   // Wall Elements
    @serializable(AssetReference)
    wallElementEmpty!: AssetReference;
    @serializable(AssetReference)
    wallElementCC!: AssetReference;
    @serializable(AssetReference)
    wallElementCJ?: AssetReference;
    @serializable(AssetReference)
    wallElementJC?: AssetReference;
    @serializable(AssetReference)
    wallElementJJ?: AssetReference;
    @serializable(AssetReference)
    wallElementJN?: AssetReference;
    @serializable(AssetReference)
    wallElementNJ?: AssetReference;
    @serializable(AssetReference)
    wallElementNN?: AssetReference;
    @serializable(AssetReference)
    wallElementNC?: AssetReference;
    @serializable(AssetReference)
    wallElementCN?: AssetReference;
    // Inner Barrier Elements
    @serializable(AssetReference)
    innerBarrierElements?: AssetReference;
    @serializable(AssetReference)
    innerBarrierEmpty? : AssetReference;
    @serializable(AssetReference)
    innerBarrierCCC? : AssetReference;
    @serializable(AssetReference)
    innerBarrierNCC? : AssetReference;
    @serializable(AssetReference)
    innerBarrierNCN? : AssetReference;
    @serializable(AssetReference)
    innerBarrierCCN? : AssetReference;
    @serializable(AssetReference)
    innerBarrierNNN? : AssetReference;
    @serializable(AssetReference)
    innerBarrierCNN? : AssetReference;
    @serializable(AssetReference)
    innerBarrierCNC? : AssetReference;
    @serializable(AssetReference)
    innerBarrierNNC? : AssetReference;
    // Outer Barrier Elements
    @serializable(AssetReference)
    outerBarrierElements? : AssetReference;
    @serializable(AssetReference)
    outerBarrierEmpty? : AssetReference;
    @serializable(AssetReference)
    outerBarrierNNN? : AssetReference;
    @serializable(AssetReference)
    outerBarrierNCN? : AssetReference;
    @serializable(AssetReference)
    outerBarrierNNC? : AssetReference;
    @serializable(AssetReference)
    outerBarrierCNN? : AssetReference;
    @serializable(AssetReference)
    outerBarrierCNC? : AssetReference;
    // Centre Wall (inner wall) Elements

    @serializable(AssetReference)
    centreWallElements? :AssetReference;
    @serializable(AssetReference)
    centreWallCC? :AssetReference;
    @serializable(AssetReference)
    centreWallCN? :AssetReference;
    @serializable(AssetReference)
    centreWallNC? :AssetReference;
    @serializable(AssetReference)
    centreWallNN? :AssetReference;


 //#endregion
     async start() 
    {
           this.InstantiateMazeElements_AsyncAwait();
    }
    
    async InstantiateMazeElements_AsyncAwait() 
        {
            const opts = new InstantiateOptions;
            for (let i = 0; i < this.mazeDatabase.maze.mazeLayout.mazeSize; i++)
            {
                const q : Quaternion = new Quaternion();
                q.setFromAxisAngle(new Vector3(0,0,-1),((2 * Math.PI)/10)* i)
                opts.rotation = q;
                opts.position = this.worldPosition

                let centreWallElement = this.mazeDatabase.maze.mazeLayout.centreWallElement;
                let wallElement = this.mazeDatabase.maze.mazeLayout.wallElements.find(obj => obj.position === i)
                let innerBarrierElement = this.mazeDatabase.maze.mazeLayout.innerBarrierElements.find(obj => obj.position === i)
                let outerBarrierElement = this.mazeDatabase.maze.mazeLayout.outerBarrierElements.find(obj => obj.position === i)
                 if (wallElement)
                 {
                    console.log('the wall object type is: ' + wallElement.variant)
                     switch (wallElement.variant)
                     {
                         case 'empty': {
                            await this.InstantiateMazeElement(this.wallElementEmpty, wallElement, opts, true)
                            break
                         }
                         case 'CC': {
                            await this.InstantiateMazeElement(this.wallElementCC, wallElement, opts, true)
                            break
                         }
                         case 'CJ': {
                            await this.InstantiateMazeElement(this.wallElementCJ,wallElement, opts, true)
                             break
                         }
                         case 'JC': {
                            await this.InstantiateMazeElement(this.wallElementJC,wallElement, opts, true)
                             break
                         }
                         case 'JJ': {
                            await this.InstantiateMazeElement(this.wallElementJJ,wallElement, opts, true)
                             break
                         }
                         case 'JN': {
                            await this.InstantiateMazeElement(this.wallElementJN, wallElement,opts, true)
                             break
                         }
                         case 'NJ': {
                            await this.InstantiateMazeElement(this.wallElementNJ,  wallElement, opts, true)
                             break
                         }
                         case 'NN': {
                            await this.InstantiateMazeElement(this.wallElementNN, wallElement,  opts, true)
                             break
                         }
                         case 'NC': {
                            await this.InstantiateMazeElement(this.wallElementNC, wallElement,  opts, true)
                             break
                         }
                         case 'CN': {
                            await this.InstantiateMazeElement(this.wallElementCN, wallElement,  opts, true)
                             break
                         }
                     }
                 }
                 if (innerBarrierElement) 
                 {
                    console.log('the wall object type is: ' + innerBarrierElement.variant)
                    switch (innerBarrierElement.variant)
                    {
                        case 'empty': {
                            await this.InstantiateMazeElement(this.innerBarrierEmpty,innerBarrierElement, opts, true)
                            break}
                        case 'CCC': {
                            await this.InstantiateMazeElement(this.innerBarrierCCC,innerBarrierElement, opts, true)
                            break}
                        case 'CCN': {
                            await this.InstantiateMazeElement(this.innerBarrierCCN,innerBarrierElement, opts, true)
                            break}
                        case 'CNC': {
                            await this.InstantiateMazeElement(this.innerBarrierCNC,innerBarrierElement, opts, true)
                            break}
                        case 'CNN': {
                            await this.InstantiateMazeElement(this.innerBarrierCNN,innerBarrierElement, opts, true)
                        break;}
                        case 'NCC': {
                            await this.InstantiateMazeElement(this.innerBarrierNCC,innerBarrierElement, opts, true)
                        break;}
                        case 'NCN': {
                            await this.InstantiateMazeElement(this.innerBarrierNCN,innerBarrierElement, opts, true)
                        break;}
                        case 'NNC': {
                            await this.InstantiateMazeElement(this.innerBarrierNNC,innerBarrierElement, opts, true)
                        break;}
                        case 'NNN': {
                            await this.InstantiateMazeElement(this.innerBarrierNNN,innerBarrierElement, opts, true)
                        break;}
                        
                    }
                 }
                 if (outerBarrierElement) {
                    console.log('OB type is: ' + outerBarrierElement.variant)

                    switch (outerBarrierElement.variant)
                    {
                        case 'empty' :
                        {
                            this.InstantiateMazeElement(this.outerBarrierEmpty,outerBarrierElement, opts, false);
                            break;
                        }
                        case 'NNN' :
                        {
                            this.InstantiateMazeElement(this.outerBarrierNNN,outerBarrierElement, opts, false);
                            break;
                        }
                        case 'CNC' :
                        {
                            this.InstantiateMazeElement(this.outerBarrierCNC,outerBarrierElement, opts, false);
                            break;
                        }
                        case 'CNN' :
                        {
                            this.InstantiateMazeElement(this.outerBarrierCNN,outerBarrierElement, opts, false);
                            break;
                        }
                        case 'NCN' :
                        {
                            this.InstantiateMazeElement(this.outerBarrierNCN,outerBarrierElement, opts, false);
                            break;
                        }
                        case 'NNC' :
                        {
                            this.InstantiateMazeElement(this.outerBarrierNNC,outerBarrierElement, opts, false);
                            break;
                        }
                    }
                
                 }
                 if (centreWallElement.position == i)
                 {
                    switch (centreWallElement.variant) {
                        case 'CC' :
                        {
                            this.InstantiateMazeElement(this.centreWallCC, centreWallElement, opts, false)
                            break;
                        }
                        case 'CN' :
                        {
                            this.InstantiateMazeElement(this.centreWallCN, centreWallElement, opts, false)
                            break;
                        }
                        case 'NC' :
                        {
                            this.InstantiateMazeElement(this.centreWallNC, centreWallElement, opts, false)
                            break;
                        }
                        case 'NN' :
                        {
                            this.InstantiateMazeElement(this.centreWallNN, centreWallElement, opts, false)
                            break;
                        }
                    }
                 }

             }
    }
    
    radiansToDegrees(radians : number) {
        const degrees = radians * (180 / Math.PI);
        return degrees;
    }
    
    GetAssetReference<V>(elementType : MazeElement<V>) : AssetReference | undefined | null
    {
        // Helper function that takes the element type and returns the corresponding asset reference
        let variant = elementType.variant;
        if (elementType instanceof WallElement) {
            switch (variant) {
                case 'CC' :
                    {return this.wallElementCC}
                case 'CN' :
                    {return this.wallElementCN}
                case 'NC' :
                    {return this.wallElementNC}
                case 'NN' :
                    {return this.wallElementNN}
                case 'NJ' :
                    {return this.wallElementNJ}
                case 'CJ' :
                    {return this.wallElementCJ}
                case 'JN' :
                    {return this.wallElementJN}
                case 'NJ' :
                    {return this.wallElementNJ}
                case 'JC'   :   
                    {return this.wallElementJC}
                case null   :
                    {console.log("Element type is null");
                    return null}                  
            }
        }
        else if (elementType instanceof BarrierElement) 
        {
            switch (variant) 
            {
                case 'CCC' :  return this.innerBarrierCCC;
                case 'CCN' :  return this.innerBarrierCCN;
                case 'CNC' :  return this.innerBarrierCNC;
                case 'CNN' :  return this.innerBarrierCNN;
                case 'NCC' :  return this.innerBarrierNCC;
                case 'NCN' :  return this.innerBarrierNCN;
                case 'NNC' :  return this.innerBarrierNNC;
                case 'NNN' :  return this.innerBarrierNNN;
                case null  :  
                {console.log("Element type is null");
                return null}
            }
        }

        else if (elementType instanceof OuterBarrierElement) {
            switch (variant) {
                case 'NNN' :  return this.outerBarrierNNN;
                case 'CNC' :  return this.outerBarrierCNC;
                case 'CNN' :  return this.outerBarrierCNN;
                case 'NCN' :  return this.outerBarrierNCN;
                case 'NNC' :  return this.outerBarrierNNC;
                case null  : 
                {console.log("Element type is null");
                return null}
        
    }
        }

        else if (elementType instanceof CentreWallElement) {
            switch (variant) {
                case 'CC' :  return this.centreWallCC;
                case 'CN' :  return this.centreWallCN;
                case 'NC' :  return this.centreWallNC;
                case 'NN' :  return this.centreWallNN;
                case null : 
                {console.log("Element type is null");
                return null}
            }
        }
        return null
    }
    async InstantiateRequestedMazeElement<V>(element : MazeElement<V>) 
{
    let opts = new InstantiateOptions();
    const q : Quaternion = new Quaternion();
    q.setFromAxisAngle(new Vector3(0,0,-1),((2 * Math.PI)/10)* element.position);
    opts.rotation = q;
    opts.position = this.worldPosition
    try 
    {
        const gameObject = await this.GetAssetReference(element)!.instantiate(opts) as GameObject;
        this.gameObject.add(gameObject);
            
            console.log(element.position);            
            if (!gameObject.getComponentInParent(MazeElementProfile)) 
                {
                    gameObject.addComponent(MazeElementProfile);
                }
            const mazeElementProfile = gameObject.getComponentInParent(MazeElementProfile);
            mazeElementProfile!.mazeElement =element;
    }
    catch {
        console.log('error');
    }
}

    async InstantiateMazeElement<V>(element : AssetReference | undefined, mazeElement : MazeElement<V>, opts : InstantiateOptions, isDebug : boolean)
    {
        try 
        {   
            const gameObject = await element?.instantiate(opts) as GameObject;
            // let x = this.radiansToDegrees(gameObject.rotation.x);
            // let y = this.radiansToDegrees(gameObject.rotation.y);
            // let z = this.radiansToDegrees(gameObject.rotation.z);
            // console.log('x =  ' + x, 'y =  ' + y, 'z =  ' + z);
            this.gameObject.add(gameObject);
            
            console.log(mazeElement.position);            
            if (!gameObject.getComponentInParent(MazeElementProfile)) 
                {
                    gameObject.addComponent(MazeElementProfile);
                }
            const mazeElementProfile = gameObject.getComponentInParent(MazeElementProfile);
            mazeElementProfile!.mazeElement = mazeElement;
            // if (isDebug) console.log(gameObject?.name)
            // How to get the name of the element type??
        }
        catch   
        {
            console.log('error')
        }
            
            
    }
}