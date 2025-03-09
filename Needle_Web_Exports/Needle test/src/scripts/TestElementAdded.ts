import { Behaviour, serializable } from "@needle-tools/engine";
import { MazeRenderer } from "./MazeRenderer";
import { WallElement, BarrierElement, OuterBarrierElement } from "../MazeData";
import { MazeDatabase } from "./MazeDatabase";


export class TestElementAdded extends Behaviour {

@serializable(MazeDatabase)
mazeDatabase!: MazeDatabase;

testWallElement? : WallElement;
testWallElement2? : WallElement;
async start() {
    this.testWallElement= new WallElement( 5 ,null);
    console.log(this.testWallElement);
    this.mazeDatabase.maze.AddMazeElement(this.testWallElement);

    this.testWallElement2= new WallElement( 8 ,null);
    console.log(this.testWallElement2);
    this.mazeDatabase.maze.AddMazeElement(this.testWallElement2);

    
    let testWallElement3 = new BarrierElement( 2 ,null);
    this.mazeDatabase.maze.AddMazeElement(testWallElement3);


}
}