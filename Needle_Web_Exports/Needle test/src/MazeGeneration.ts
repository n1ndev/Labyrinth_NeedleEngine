
// import * as SeededRandomModule from './SeededRandom';
// Importing with default import syntax
// import { SeededRandom } from "./SeededRandom";


 class SeededRandom {
    private seed: number;
    private readonly a: number = 1664525;
    private readonly c: number = 1013904223;
    private readonly m: number = 2 ** 32;
  
    constructor(seed: number) {
      this.seed = seed;
    }
  
    // Generates a pseudo-random integer
    public randomInt(): number {
      this.seed = (this.a * this.seed + this.c) % this.m;
      return this.seed;
    }
  
    // Generates a pseudo-random integer within a specified range [min, max]
    public randomInRange(min: number, max: number): number {
      // Ensure the output is within [0, 1)
      const randomNumber = this.randomInt() / this.m;
      // Scale the number to the desired range and round it to get an integer
      return Math.floor(min + randomNumber * (max - min + 1));
    }
  }
   
const rnd = new SeededRandom(2);
// console.log(rnd.randomInRange(0,2));
let debug = true;

const layerSize = 10;
const mazeLayers = 2;

const mazeCells : boolean[][] = [
    new Array(5).fill(false),
    new Array(10).fill(false),
    new Array(10).fill(false),
]

const middleWalls : boolean[] = new Array<boolean>(10).fill(true);
const innerBarrier : boolean[] = new Array<boolean>(10).fill(true);
const outerBarrier : boolean[] = new Array<boolean>(10).fill(true);

const stack: MazePosition[] =[]

GenerateMaze();
console.log(middleWalls);
console.log(innerBarrier);
console.log(outerBarrier);

type Movement = {
    direction: Direction
    position : MazePosition,
};

function GetLastLayerIndex() : number
{
    return mazeCells.length - 1
}

//Helper function for when needing to wrap around a position
function GetLastIndexAtLayer(layer : number) : number
{
    return mazeCells[layer].length - 1
} 

let currentCell : MazePosition;

type Direction = 'outward' | 'inward' | 'clockwise' | 'anticlockwise'

// enum Direction  {  
//     'outward',
//     'inward',
//     'clockwise',
//     'anticlockwise'
    
// }

function GetAdjacentPosition(position: MazePosition, direction:Direction) : MazePosition | null
{
    // variation of this function where we return an object with status and data
    // success boolean and position 
    switch (direction)
    {
        case 'outward' :
        {
            if (position.longitude == GetLastLayerIndex())
            {
                if(debug)
                {
                   console.log(`No position outward of ${position.longitude}, ${position.latitude}`)                  
                }
                return null
            }
            else
            {
                return { longitude : position.longitude + 1, latitude : position.latitude}
            }
            break;
        }
        
        case 'inward' : 
        {
            if ((position.longitude - 1) == 0)
            {
                if (debug)
                {
                    console.log(`No position inward of ${position.longitude}, ${position.latitude}`)
                }
                return null
            }
            else
            {
                return {longitude : position.longitude - 1, latitude : position.latitude}
            }
        break;
        }
        case 'clockwise': {
            if (position.latitude == GetLastIndexAtLayer(position.longitude)) 
            {
                return {longitude : position.longitude, latitude : 0}
            }
            else return {longitude:position.longitude, latitude:position.latitude + 1}
            break;
        }
        case 'anticlockwise': {
            if (position.latitude == 0) 
            {
                return {longitude : position.longitude, latitude : GetLastIndexAtLayer(position.longitude)}
            }
            else return {longitude:position.longitude, latitude:position.latitude -1}
            break;
        }
    }
}

function GetUnvisitedNeighbours(position : MazePosition) : Movement[]
{
    const neighbours : Movement[] = []

    // for (let directions in Direction)
    // {

    // }
    
    let adjacentPosition = GetAdjacentPosition(position, 'outward')
    if (adjacentPosition && mazeCells[adjacentPosition.longitude][adjacentPosition.latitude] == false) 
    {
        neighbours.push({direction:'outward',position:adjacentPosition});
    }
    adjacentPosition = GetAdjacentPosition(position, 'inward')
    if (adjacentPosition && mazeCells[adjacentPosition.longitude][adjacentPosition.latitude] == false) 
    {
        neighbours.push({direction:'inward',position:adjacentPosition});
    }
    adjacentPosition = GetAdjacentPosition(position, 'clockwise')
    if (adjacentPosition && mazeCells[adjacentPosition.longitude][adjacentPosition.latitude] == false ) 
    {
        neighbours.push({direction: 'clockwise', position:adjacentPosition});
    }
    adjacentPosition = GetAdjacentPosition(position, 'anticlockwise')
    if (adjacentPosition && mazeCells[adjacentPosition.longitude][adjacentPosition.latitude] == false) 
    {
        neighbours.push({direction:'anticlockwise',position:adjacentPosition});
    }
    return neighbours

}

function GenerateMaze()
{
    currentCell = {longitude : 2, latitude : 0}
    mazeCells[currentCell.longitude][currentCell.latitude] = true;
    stack.push(currentCell);
    let neighbours : Movement[] = []
    let i = 0
    while(stack.length > 0)
    {
        console.log(`Generation Step: ${i}`);
        currentCell = stack.pop()!;
        console.log(currentCell);
        neighbours = GetUnvisitedNeighbours(currentCell)
        console.log(neighbours);
        if (neighbours.length > 0)
        {
            stack.push(currentCell);
            let chosenCell = neighbours[rnd.randomInRange(0,neighbours.length-1)]
            RemoveBarrier(currentCell, chosenCell)
            // Mark the chosen cell as visited
            mazeCells[chosenCell.position.longitude][chosenCell.position.latitude] = true;
            stack.push(chosenCell.position);
        }
        else
        {
            console.log('Found no neighbours');
        }
        i++;
        
    }
}

type MazePosition = {
longitude: number,
latitude: number
}


function RemoveBarrier(currentPos: MazePosition, movement : Movement) {
    // We need to get the corresponding barrier and set to false!
    switch(movement.direction)
    {
        case 'outward' :
        {
            if (debug) console.log(`Removing middle wall at ${currentPos.latitude}`)
            middleWalls[currentPos.latitude] = false;
            break;
        }
        case 'inward'  :
        {
            if (debug) console.log(`Removing middle wall at ${currentPos.latitude}`)
            middleWalls[currentPos.latitude] = false;
            break;
        }
        case 'clockwise' :
        {
            if(currentPos.latitude == GetLastIndexAtLayer(currentPos.longitude))
            {
                if(currentPos.longitude == 2) 
                {
                    if (debug) console.log(`Removing outer barrier: 0`);
                    outerBarrier[0] = false;
                }
                else if (currentPos.longitude == 1) 
                {
                    if (debug) console.log(`Removing inner barrier: 0`);
                    innerBarrier[0] = false;
                }
            }
            else
            {
                if(currentPos.longitude == 2) 
                {
                    
                    outerBarrier[movement.position.latitude] = false;
                    if (debug) console.log(`Removing outer barrier: ${movement.position.latitude}`);
                }
                else if (currentPos.longitude == 1) 
                {
                    if (debug) console.log(`Removing inner barrier: ${movement.position.latitude}`);
                    innerBarrier[movement.position.latitude] = false;
                }
            }
            break;
        }
    
        case 'anticlockwise' :
        {
                if(currentPos.latitude == 0)
                {
                    if(currentPos.longitude == 2) 
                    {
                        outerBarrier[0] = false
                        if (debug) console.log(`Removing outer barrier: ${GetLastIndexAtLayer(2)}`);
                    }
                    else if (currentPos.longitude == 1) 
                    {
                        innerBarrier[0] = false
                        if (debug) console.log(`Removing inner barrier: ${GetLastIndexAtLayer(2)}`);
                    }
                }
            else 
            {
                if(currentPos.longitude == 2)
                {
                    outerBarrier[currentPos.latitude] = false
                } 
                else if(currentPos.longitude == 1)
                {
                  innerBarrier[currentPos.latitude] = false
                }
            }
            break;
        
    }
}
}
// 


/*

2D Array to represent the maze 
bool [2][10]


Path finding algo
Random walk? Depth search?

Function Move latitudinally (across same layer)
Function Move logitudinally (up/down different layer)
Current position = [x][y] 
Check adjacent cells if they haven't been visited yet, then move into that cell
Set the position to true i.e. visited e.g. [1][5] = true
Travelling from 1 cell into another, will remove the logitudinal or latitudinal wall at the
corresponding position, i.e. going from [0][0] -> [0][1] will set outerBarriers[1] to false
The algorithm will continue moving until all cells have been visited

How to stop the algorithm from getting stuck going down routes it has already been to?
i.e. backtracking?
- When going into a new cell, push that cell into a 'backtracking' array
- When a cell has no unvisited neighbours, move back to previous cell in backing array 
- and pop it

Before generation starts, pick a random exit position G.
Prevent a barrier from appearing in the middle of 
the exit door by setting innerBarrier[G] = false
Alternatively...
The algorithm could find an exit by treating the inner wall as a potential neighbour.
There would need to be another variable i.e. exit flag, that gets set when the exit first 
visited, so that another exit cannot be formed. Additionally, might need to start
the position array at the start [3][10] and treat the middle at 0,[]

Is it possible and if so, how to combine this maze generation approach with the
node-feature based maze design. 
Maybe it is do with doing this generation process in reverse? i.e. start from the exit?
Maybe it is do with implementing each node feature as a particular movement i.e.
a >| is a longitudinal movement or smth. When a node is acted out, we eliminate and check for
the next node to act?

*/ 

