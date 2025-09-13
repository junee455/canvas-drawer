import { CanvasDrawer } from "../canvasDrawer";
import { GPoint } from "../graphicPrimitives";
import { BasicTool, Tool } from "./basicTool";

export class PointTool extends BasicTool implements Tool {
  constructor(protected canvas: CanvasDrawer) {
    super(canvas);
  }

  public override onMouseDown(ev: MouseEvent) {
    const point = this.canvas.screenCoordsToCanvasCoords(
      ev.clientX,
      ev.clientY
    );

    const nextPoint: GPoint = {
      name: "Point",
      priority: 0,
      geometry: point,
      description: {
        color: "#0000ff",
      },
    };

    this.canvas.addPrimitive(nextPoint);
  }
}
