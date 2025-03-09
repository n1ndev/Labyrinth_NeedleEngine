import { Behaviour, IPointerEventHandler, PointerEventData } from "@needle-tools/engine";
import { MazeElementProfile } from "./MazeElementProfile";
import { Rotate } from "./Rotate";
import { MazeDatabase } from "./MazeDatabase";
import { WallElement } from "../MazeData";
export class PointerTest extends Behaviour implements IPointerEventHandler {

    mazeElementTest : WallElement = {position: 0, variant: null};
    onPointerClick(args: PointerEventData) {
                console.log("Click", args);
               this.gameObject.getComponentInParent(MazeDatabase)?.maze.AddMazeElement(this.mazeElementTest);
    }

    onPointerEnter(args: PointerEventData) {
        console.log("Hovering", args)
        console.log(this.gameObject.getComponentInParent(MazeElementProfile)?.mazeElement);
        this.gameObject.getComponentInParent(Rotate)!.speed = 0;
        // console.log(this.gameObject.name);
    }

    onPointerExit(args: PointerEventData) {
        console.log("Exiting Hover", args)
        this.gameObject.getComponentInParent(Rotate)!.speed = 0.25;
    }
}
