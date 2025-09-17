import { CanvasDrawer } from "../canvasDrawer";
import { GLine } from "../graphicPrimitives";
import { Line } from "../primitives";
import { BasicTool, Tool } from "./basicTool";

export class ErazerTool extends BasicTool implements Tool {
  private erasing = false;

  // radius in px;
  private brushSize = 100;

  constructor(protected canvas: CanvasDrawer) {
    super(canvas);
  }

  private isPointUnderCursor(
    clientX: number,
    clientY: number,
    pt: [number, number]
  ) {
    const dist_x = Math.abs(pt[0] - clientX);
    const dist_y = Math.abs(pt[1] - clientY);

    const brushSize = this.brushSize / this.canvas.scale;

    if (dist_x <= brushSize / 2 && dist_y <= brushSize / 2) {
      return true;
    }

    return false;
  }

  private removePointsUnderCursor(clientX: number, clientY: number) {
    const newPoints = this.canvas.primitives
      .filter((p) => p.name === "Point")
      .filter((pt) => {
        return !this.isPointUnderCursor(clientX, clientY, pt.geometry);
      });

    const newLines = this.canvas.primitives
      .filter((p) => p.name === "Line")
      .map((line) => {
        // let nextLineSegmentGeometry: Line = [];

        const newLineGeometry: Line[] = [];

        line.geometry.forEach((lineSeg) => {
          let nextPoints: Line = [];

          for (const pt of lineSeg) {
            if (!this.isPointUnderCursor(clientX, clientY, pt)) {
              nextPoints.push(pt);
            } else {
              if (nextPoints.length >= 2) {
                newLineGeometry.push(nextPoints);
              }

              nextPoints = [];
            }
          }

          if (nextPoints.length >= 2) {
            newLineGeometry.push(nextPoints);
          }
        });

        return {
          ...line,
          geometry: newLineGeometry.filter((g) => g.length >= 2),
        };
      })
      .filter((l) => l.geometry.length > 0);

    this.canvas.primitives = [...newLines, ...newPoints];

    this.canvas.resortPrimitives();
  }

  private drawBrush(clientX: number, clientY: number) {
    this.canvas.redraw();

    this.canvas.ctx.lineJoin = "miter";
    // this.canvas.ctx.line

    const brushSize = this.brushSize / this.canvas.scale;

    const x = clientX - brushSize / 2;
    const y = clientY - brushSize / 2;

    if (this.erasing) {
      this.canvas.ctx.fillStyle = "pink";
      this.canvas.ctx.fillRect(x, y, brushSize, brushSize);
    } else {
      this.canvas.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      this.canvas.ctx.fillRect(x, y, brushSize, brushSize);
    }
  }

  private checkIfErazing(ev: MouseEvent) {
    type MouseButtonName = "left" | "right" | "middle";

    const buttonNames: MouseButtonName[] = ["left", "right", "middle"];

    const mouseButtonPressed = buttonNames.filter(
      (b, i) => ev.buttons & (1 << i)
    );

    const modifiersPressed = ev.shiftKey || ev.ctrlKey || ev.altKey;

    let onlyLeftButton = false;

    if (mouseButtonPressed.length === 1 && mouseButtonPressed[0] === "left") {
      onlyLeftButton = true;
    }

    if (!modifiersPressed && onlyLeftButton) {
      this.erasing = true;
    } else {
      this.erasing = false;
    }
  }

  public override onMouseDown(ev: MouseEvent) {
    // if (!modifiersPressed && onlyLeftButton) {
    //   customCursorEl.style.display = "none";
    // } else {
    //   customCursorEl.style.display = "block";
    // }
    this.checkIfErazing(ev);

    if (!this.erasing) {
      return;
    }

    const point = this.canvas.screenCoordsToCanvasCoords(
      ev.clientX,
      ev.clientY
    );

    this.removePointsUnderCursor(...point);

    this.drawBrush(...point);
  }

  public override onMouseUp(ev: MouseEvent) {
    this.erasing = false;

    this.canvas.redraw();
  }

  public override onMouseMove(ev: MouseEvent) {
    this.checkIfErazing(ev);

    const point = this.canvas.screenCoordsToCanvasCoords(
      ev.clientX,
      ev.clientY
    );

    this.drawBrush(...point);

    if (!this.erasing) {
      return;
    }

    this.removePointsUnderCursor(...point);
  }
}
