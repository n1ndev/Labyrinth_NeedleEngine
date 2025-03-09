
// This is a needle component intended to attach onto a maze element gameobject
// it is used to contain info about the particular element type
// such as it's variant type and position
// 
import { Behaviour } from "@needle-tools/engine";
import { MazeElement } from "../MazeData"; 
export class MazeElementProfile extends Behaviour {

public mazeElement  :  MazeElement<any> | null = null;
}




