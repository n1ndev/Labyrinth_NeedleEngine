
// This file contains the Maze class and MazeData definitions which includes each maze element type
// For example, Maze.ts, MazeData.ts, MazeRenderer.ts and so on
// Anyway, what this is does is define the data structure and formats the data into usable elements
// It, in part, figures out which elements are present in the maze and labels them accordinging to where the element is located
// and what other elements it neighbours with. There is taxonomy of names that are shorthanded to 'CC' or 'NC' etc.
// where C stands for 'connected' and N stands for 'not connected'

// We are using the array'boolean' type to represent whether or not an element is present in the maze and the 
// index is the position of the element in the maze. i.e. 0
// We have modelled the maze into longitudinal and latitudinal elements, with the longitudinal elements being
// the walls and the latitudinal elements being the inner and outer barriers
// At the moment we are calculating each set of wall elements in one go
// Later we will add functionality to calculate individual wall elements 
// Eventually we will have a feature where a user can click on a wall element,
// and the wall element will be toggled on/off 

export class Maze {

    // Idea of reimplementing/generalising this for n-sized mazes i.e. more than 1 inner wall
    public mazeLayout: MazeElementLayout

    private onElementAddedCallbacks: ((element: MazeElement<any>) => void)[] = [];
    public subscribeToElementAdded(callback: (element: MazeElement<any>) => void) {
        this.onElementAddedCallbacks.push(callback);
        console.log("Subscribing to element added: ", callback.toString);
    }

    private notifiyElementAdded(element: MazeElement<any>) {
        this.onElementAddedCallbacks.forEach(callback => callback(element));
        console.log("Notiftying element added");
    }


    // Maze elements - representing configurable parts
    mazeWallElements: boolean[]
    mazeInnerBarrierElements: boolean[]
    mazeOuterBarrierElements: boolean[]

    // constructor signatures
    constructor(mazeLayout: MazeElementLayout);
    constructor(mazeLayout: MazeBooleanLayout);

    constructor(mazeLayout: MazeElementLayout | MazeBooleanLayout) {
        if (Maze.isBooleanLayout(mazeLayout)) {
            this.mazeInnerBarrierElements = mazeLayout[0];
            this.mazeWallElements = mazeLayout[1];
            this.mazeOuterBarrierElements = mazeLayout[2];
            
            // Create an empty maze layout
            this.mazeLayout = {
                mazeSize: mazeLayout[0].length,
                innerBarrierElements: [],
                outerBarrierElements: [],
                wallElements: [],   
                centreWallElement: { position: 0, variant: null }
            }
            this.ProcessWallElements();
            this.ProcessInnerBarrierElements();
            this.ProcessOuterBarrierElements();
            this.ProcessCentreWallElement();
        }
        else {
            this.mazeLayout = mazeLayout
            this.mazeWallElements = Array<boolean>(mazeLayout.mazeSize).fill(false);
            this.mazeInnerBarrierElements = Array<boolean>(mazeLayout.mazeSize).fill(false);
            this.mazeOuterBarrierElements = Array<boolean>(mazeLayout.mazeSize).fill(false);
            this.InitialiseMazeElementArrays();
            this.ProcessWallElements();
            this.ProcessInnerBarrierElements();
            this.ProcessOuterBarrierElements();
            this.ProcessCentreWallElement();
        }
    }

    static isBooleanLayout(layout: MazeBooleanLayout | MazeElementLayout): layout is MazeBooleanLayout {
        return Array.isArray(layout) && layout.length === 3 && layout.every(row => row.length === 10);
    }



    // Potential for adding another constructor that takes in boolean[] arrays for 
    // representing the maze
    // constructor(mazeWallElements: boolean[], mazeBarrierElements: boolean[], mazeOuterBarrierElements: boolean[]) {}
    // as well as as constructor that is a 2D array of booleans i.e. [[],[],[]] or boolean[][]



    InitialiseMazeElementArrays() {

        for (let i = 0; i < this.mazeLayout.mazeSize; i++) {
            let wallObject = this.mazeLayout.wallElements.find(mazeElement => mazeElement.position === i);
            (wallObject) ? this.mazeWallElements[i] = true : this.mazeWallElements[i] = false

            let barrierObject = this.mazeLayout.innerBarrierElements.find(mazeElement => mazeElement.position === i);
            (barrierObject) ? this.mazeInnerBarrierElements[i] = true : this.mazeInnerBarrierElements[i] = false

            let outerBarrierObject = this.mazeLayout.outerBarrierElements.find(mazeElement => mazeElement.position === i);
            (outerBarrierObject) ? this.mazeOuterBarrierElements[i] = true : this.mazeOuterBarrierElements[i] = false
        }

    }

    ProcessWallElements(): void {
        let nextElement: number;
        let previousElement: number;

        for (let i = 0; i < this.mazeLayout.mazeSize; i++) {
            // Set the value for nextElement and previousElement and account for when the 
            // next or previous element would be outside the array
            (i == this.mazeLayout.mazeSize - 1) ? nextElement = 0 : nextElement = i + 1;
            (i == 0) ? previousElement = this.mazeLayout.mazeSize - 1 : previousElement = i - 1;

            let wallObject = this.mazeLayout.wallElements.find(obj => obj.position === i)
            // check if there is a actually a wall object at that index 
            if (!wallObject) {
                wallObject = new WallElement(i, null);
                this.mazeLayout.wallElements.push(wallObject);
            }

            // First, check if there is a wall element at that index
            if (this.mazeWallElements[i]) {
                // Check if the maze piece has a barrier element at that index
                if (this.mazeInnerBarrierElements[i]) {
                    if (this.mazeInnerBarrierElements[nextElement]) {
                        wallObject.variant = 'JJ'
                    }
                    else if (this.mazeWallElements[nextElement]) {
                        wallObject.variant = 'JC'
                    }
                    else {
                        wallObject.variant = 'JN'
                    }
                }
                else if (this.mazeInnerBarrierElements[nextElement]) {
                    if (this.mazeWallElements[previousElement]) {
                        wallObject.variant = 'CJ'
                    }
                    else {
                        wallObject.variant = 'NJ'
                    }
                }
                else if (this.mazeWallElements[previousElement]) {
                    if (this.mazeWallElements[nextElement]) {
                        wallObject.variant = 'CC'
                    }
                    else {
                        wallObject.variant = 'CN'
                    }
                }
                else if (this.mazeWallElements[nextElement]) {
                    wallObject.variant = 'NC'

                }
                else {
                    wallObject.variant = 'NN'
                }
            }
            else {wallObject.variant = 'empty'}
        }
    }


    ProcessInnerBarrierElements(): void {
        /*
            Loop through each element and check for adjacent elements
        */

        let previousElement: number;

        for (let i = 0; i < this.mazeLayout.mazeSize; i++) {
            // Set the value for nextElement and previousElement and account for when the 
            // next or previous element would be outside array bounds
            (i == 0) ? previousElement = this.mazeLayout.mazeSize - 1 : previousElement = i - 1;

            let innerBarrierElement = this.mazeLayout.innerBarrierElements.find(obj => obj.position === i)
            // check if there is a actually a wall object at that index 
            if (!innerBarrierElement) {
                innerBarrierElement = new BarrierElement(i, null);
                this.mazeLayout.innerBarrierElements.push(innerBarrierElement);
            }
            if(this.mazeInnerBarrierElements[i]) {
                
            
                // Split branch for inner barriers that do or don't have a connecting outerbarrier
                if (this.mazeOuterBarrierElements[i]) {
                    // -C-
                    if (this.mazeWallElements[previousElement]) {
                        // CC-
                        if (this.mazeWallElements[i]) innerBarrierElement.variant = 'CCC';
                        else innerBarrierElement.variant = 'CCN';
                    }
                    else {
                        // NC-
                        if (this.mazeWallElements[i]) innerBarrierElement.variant = 'NCC'
                        else innerBarrierElement.variant = 'NCN'
                    }
                }
                else {
                    // -N-
                    if (this.mazeWallElements[previousElement]) {
                        // CN-
                        if (this.mazeWallElements[i]) innerBarrierElement.variant = 'CNC';
                        else innerBarrierElement.variant = 'CNN';
                    }
                    else {
                        // NN-
                        if (this.mazeWallElements[i]) innerBarrierElement.variant = 'NNC'
                        else innerBarrierElement.variant = 'NNN'
                    }

                }

            }
            else {
                innerBarrierElement.variant = 'empty'
            }
        }
        }
    

    ProcessOuterBarrierElements(): void {
        let previousElement: number;

        for (let i = 0; i < this.mazeLayout.mazeSize; i++) {
            // Set the value for nextElement and previousElement and account for when the 
            // next or previous element would be outside array bounds
            (i == 0) ? previousElement = this.mazeLayout.mazeSize - 1 : previousElement = i - 1;

            let outerBarrierElement = this.mazeLayout.outerBarrierElements.find(obj => obj.position === i)

            if (!outerBarrierElement) {
                outerBarrierElement = new OuterBarrierElement(i, null);
                this.mazeLayout.outerBarrierElements.push(outerBarrierElement);
            }
                if (this.mazeOuterBarrierElements[i])
                {
                    if (this.mazeInnerBarrierElements[i]) {
                        outerBarrierElement.variant = 'NCN'
                    }
                    else if (this.mazeWallElements[previousElement]) {
                        if (this.mazeWallElements[i]) outerBarrierElement.variant = 'CNC'
                        else outerBarrierElement.variant = 'CNN'
    
                    }
                    else if (this.mazeWallElements[i]) outerBarrierElement.variant = 'NNC'
                    else (outerBarrierElement.variant = 'NNN')
                    
                }
                else{
                    outerBarrierElement.variant = 'empty';
                }

            
        }
    }
    ProcessCentreWallElement(): void {
        let nextElement: number;
        let centreWallElement = this.mazeLayout.centreWallElement;

        // Set the value for nextElement and previousElement and account for when the 
        // next or previous element would be outside array bounds
        let i: number = centreWallElement.position;
        (i == this.mazeLayout.mazeSize - 1) ? nextElement = 1 : nextElement = i + 2;
        if (i == this.mazeLayout.mazeSize - 2) nextElement = 0
        if (centreWallElement) {
            if (this.mazeInnerBarrierElements[i]) {
                if (this.mazeInnerBarrierElements[nextElement]) {
                    console.log('CC')
                    centreWallElement.variant = 'CC'
                }
                else {
                    console.log('CN')
                    centreWallElement.variant = 'CN'
                }
            }
            else if (this.mazeInnerBarrierElements[nextElement]) {
                console.log('NC')
                centreWallElement.variant = 'NC'
            }
            else {
                console.log('NN')
                centreWallElement.variant = 'NN'
            }
        }
        else {
            throw new Error("Maze data does not contain a valid centreWallElement object")
        }


    }

    CalculateElementVariant<V>(mazeElement: MazeElement<V>): void {
        // Maybe do this later if needed. Could use this in the ProcessMazeElements functions

        // Takes a maze element and updates/sets the adjacent maze element variants
        // Update the variants of this maze element first, and then adjacent maze elements
        let position = mazeElement.position;

    }
    public AddMazeElement<V>(mazeElement: MazeElement<V>): void {
        // potentially implement this to take an array of maze elements 
        if (mazeElement instanceof WallElement) {
            // check if the element is already in the array before adding 
            if (!this.mazeWallElements[mazeElement.position]) {
                this.mazeWallElements[mazeElement.position] = true
            }
            if (!this.mazeLayout.wallElements.find(obj => obj.position === mazeElement.position)) {
                this.mazeLayout.wallElements.push(mazeElement)
            }


            if (mazeElement instanceof BarrierElement) {
                if (!this.mazeInnerBarrierElements[mazeElement.position]) {
                    this.mazeInnerBarrierElements[mazeElement.position] = true
                }
                if (!this.mazeLayout.innerBarrierElements.find(obj => obj.position === mazeElement.position)) {
                    this.mazeLayout.innerBarrierElements.push(mazeElement)
                }

            }

            if (mazeElement instanceof OuterBarrierElement) {
                if (!this.mazeOuterBarrierElements[mazeElement.position]) {
                    this.mazeOuterBarrierElements[mazeElement.position] = true
                }
                if (!this.mazeLayout.outerBarrierElements.find(obj => obj.position === mazeElement.position)) {
                    this.mazeLayout.outerBarrierElements.push(mazeElement)
                }
            }

            if (mazeElement instanceof CentreWallElement) {

            }

            // Refactor a more optimised version of this code that only processes adjacent elements
            this.ProcessCentreWallElement();
            this.ProcessWallElements();
            this.ProcessInnerBarrierElements();
            this.ProcessOuterBarrierElements();
            this.notifiyElementAdded(mazeElement);

        }
    }
}
export abstract class MazeElement<V> {
    constructor(public position: number, public variant: V) { }
}

type WallElementVariantType = null | 'empty' | 'CC' | 'CJ' | 'JC' | 'JJ' | 'JN' | 'NJ' | 'NN' | 'NC' | 'CN';
export class WallElement extends MazeElement<WallElementVariantType> {
    constructor(position: number, variant: WallElementVariantType) {
        super(position, variant)
    }
}

type BarrierElementVariantType = null | 'empty' | 'CCC' | 'NCC' | 'NNC' | 'NNN' | 'CNN' | 'CCN' | 'CNC' | 'NCN';
export class BarrierElement extends MazeElement<BarrierElementVariantType> {
    constructor(position: number, variant: BarrierElementVariantType) {
        super(position, variant)
    }
}

type OuterBarrierVariantType = null | 'empty' | 'NNN' | 'NCN' | 'NNC' | 'CNN' | 'CNC';
export class OuterBarrierElement extends MazeElement<OuterBarrierVariantType> {
    constructor(position: number, variant: OuterBarrierVariantType) {
        super(position, variant)
    }
}

type CentreWallVariantType = null | 'NN' | 'NC' | 'CN' | 'CC';
export class CentreWallElement extends MazeElement<CentreWallVariantType> {
    constructor(position: number, variant: CentreWallVariantType) {
        super(position, variant)
    }
}

// export interface MazeElement {
//     position : number;
// }


// export interface WallElement extends MazeElement {
//     variant: null | 'CC' | 'CJ' | 'JC' | 'JJ' | 'JN' | 'NJ' | 'NN' | 'NC' | 'CN'
//     // Array map for variant? 
// }

// export interface BarrierElement extends MazeElement {
//     variant: null | 'CCC' | 'NCC' | 'NNC' | 'NNN' | 'CNN' | 'CCN' | 'CNC' | 'NCN'

// }

// export interface OuterBarrierElement extends MazeElement {
//     variant: null | 'NNN' | 'NCN' | 'NNC' | 'CNN' | 'CNC'
// }

// export interface CentreWallElement extends MazeElement {
//     variant : null | 'NN' | 'NC' | 'CN' | 'CC'
// }

// tuple type for a maze layout with 3 tiers of 10 indexes
export type MazeBooleanLayout = [
    [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean],
    [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean],
    [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean]
];


export interface MazeElementLayout {
    mazeSize: number;
    wallElements: WallElement[]
    innerBarrierElements: BarrierElement[]
    outerBarrierElements: OuterBarrierElement[]
    centreWallElement: CentreWallElement;
}

let mazeDataDummy: MazeElementLayout = {
    mazeSize: 10,
    wallElements: [
        { position: 0, variant: null },
        { position: 2, variant: null },
        { position: 4, variant: null },
        { position: 7, variant: null },
        { position: 9, variant: null }
    ],

    innerBarrierElements: [
        { position: 1, variant: null },
        { position: 4, variant: null }
    ],

    outerBarrierElements: [
    ],

    centreWallElement: {
        position: 1,
        variant: null
    }


}





