import { BasicTool, Tool } from "./basicTool";

import { GLine } from "../graphicPrimitives";
import { CanvasDrawer } from "../canvasDrawer";
import { Point2, vec2Sub, vecLen } from "@/lib/math";

export type LineToolSettings = {
  color: string;
};

export const lineToolDefaultSettings: LineToolSettings = {
  color: "#ffffff",
};

export class LineTool extends BasicTool implements Tool {
  private currentLine?: GLine;

  private pixelsPassed = 0;
  private prevPoint?: Point2;

  private segmentDistance = 5;

  public thickness = 2;

  public currentColor = "#ffffff";

  constructor(protected canvas: CanvasDrawer) {
    super(canvas);
  }

  public addThickness(dt: number) {
    if ((this.thickness == 1 && dt < 0) || this.thickness < 1) {
      dt /= 10;

      this.thickness = Math.max(this.thickness + dt, 0.1);
    } else {
      this.thickness = (this.thickness + dt) | 0;
    }
  }

  public override onMouseMove(ev: MouseEvent) {
    if (!this.currentLine || !this.prevPoint) {
      return;
    }

    if (ev.buttons ^ 1) {
      return;
    }

    const point = this.canvas.screenCoordsToCanvasCoords(
      ev.clientX,
      ev.clientY
    );

    const lastPoint = this.currentLine.geometry[0].slice(-1)[0];

    const mouseDelta =
      ((this.prevPoint[0] - point[0]) ** 2 +
        (this.prevPoint[1] - point[1]) ** 2) **
      0.5;

    const deltaScaled = mouseDelta * this.canvas.scale;

    // delta *= 1 /

    this.pixelsPassed += deltaScaled;

    this.prevPoint = [...point];

    if (this.pixelsPassed >= this.segmentDistance) {
      this.currentLine.geometry[0].push([...point]);
      this.pixelsPassed = 0;
    } else {
      lastPoint[0] = point[0];
      lastPoint[1] = point[1];
    }

    this.canvas.redraw();
  }

  public override onMouseDown(ev: MouseEvent) {
    if (ev.buttons ^ 1) {
      return;
    }

    this.currentLine = {
      name: "Line",
      priority: 0,
      geometry: [],
      description: {
        color: this.currentColor,
        thickness: this.thickness,
      },
    } as GLine;

    const point = this.canvas.screenCoordsToCanvasCoords(
      ev.clientX,
      ev.clientY
    );

    this.currentLine.geometry = [[[...point], [...point]]];
    this.prevPoint = [...point];

    this.pixelsPassed = 0;

    this.canvas.addPrimitive(this.currentLine);
  }

  public override onMouseUp() {
    if (this.currentLine === undefined) {
      return;
    }

    const { geometry } = this.currentLine;

    if (geometry.length === 1 && geometry[0].length === 2) {
      const g = geometry[0];

      const diff = vec2Sub(g[0], g[1]);
      if (vecLen(diff) < this.thickness) {
        const avg = [g[0][0] + diff[0] / 2, g[0][1] + diff[1] / 2] as Point2;
        this.currentLine.geometry[0] = [
          [avg[0], avg[1] + this.thickness / 2],
          [avg[0], avg[1] - this.thickness / 2],
        ];
      }
    }

    this.currentLine = undefined;

    this.canvas.redraw();
  }

  public updateSettings(newSettings: Partial<LineToolSettings>) {
    console.log(newSettings);

    const keys = Object.keys(newSettings) as (keyof LineToolSettings)[];

    if (keys.includes("color")) {
      this.currentColor = newSettings.color!;
    }
  }
}
