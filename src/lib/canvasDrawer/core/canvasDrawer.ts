import { Point2 } from "@/lib/math";
import { GLine, GPoint, KnownPrimitives } from "./graphicPrimitives";
import {
  CanvasDragScale,
  dragCanvas,
} from "@/app/canvasDrawer_v1/appContext/inputHandlers.ts";

export interface Primitive {
  render: (ctx: CanvasRenderingContext2D) => void;
}

export class CanvasDrawer {
  public ctx: CanvasRenderingContext2D;

  public primitives: KnownPrimitives[] = [];

  private primitivesSorted: KnownPrimitives[] = [];

  public pivotPoint: Point2 = [0, 0];
  public scale: number = 1;

  private mousePos: [number, number] = [0, 0];

  private lastPrimitivePriority = 0;

  public canvasDragScaleHelper = new CanvasDragScale(this);

  constructor(private canvas: HTMLCanvasElement) {
    console.log("new canvas drawer");

    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.addEventListener("contextmenu", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    });

    const resizeObserver = new ResizeObserver((entries) => {
      for (const ent of entries) {
        canvas.setAttribute("height", ent.contentRect.height.toString());
        canvas.setAttribute("width", ent.contentRect.width.toString());

        this.redraw();
        console.log("resize redraw");
      }
    });

    resizeObserver.observe(canvas.parentElement!);

    canvas.setAttribute("height", window.innerHeight.toString());
    canvas.setAttribute("width", window.innerWidth.toString());
  }

  public screenCoordsToCanvasCoords(x: number, y: number): Point2 {
    const scale = 1 / this.scale;

    return [(x - this.pivotPoint[0]) * scale, (y - this.pivotPoint[1]) * scale];
  }

  public addPrimitive(primitive: KnownPrimitives) {
    primitive.priority = this.lastPrimitivePriority;
    this.lastPrimitivePriority++;

    this.primitivesSorted.push(primitive);
    this.primitives.push(primitive);

    this.redraw();
  }

  public removeLast() {
    if (this.primitives.length === 0) {
      return;
    }

    const removeLastPrimitive = () => {
      this.primitives = this.primitives.slice(0, -1);

      this.resortPrimitives();

      if (this.primitivesSorted.length) {
        this.lastPrimitivePriority =
          this.primitivesSorted.slice(-1)[0].priority;
      } else {
        this.lastPrimitivePriority = 0;
      }
    };

    const lastPrimitive = this.primitives.slice(-1)[0];

    if (lastPrimitive.name === "Point") {
      removeLastPrimitive();
    } else if (lastPrimitive.name === "Line") {
      const lastSegmentIndex = lastPrimitive.geometry.length - 1;

      lastPrimitive.geometry[lastSegmentIndex] = lastPrimitive.geometry[
        lastSegmentIndex
      ].slice(0, -10);
      lastPrimitive.geometry = lastPrimitive.geometry.filter((s) => !!s.length);

      if (!lastPrimitive.geometry.length) {
        removeLastPrimitive();
      }
    }

    this.redraw();

    // this.lastPrimitivePriority--;
    // find primitive with that priority:

    // let lastPoint = this.points.length
    //   ? this.points[this.points.length - 1]
    //   : undefined;

    // let lastLine = this.lines.length
    //   ? this.lines[this.lines.length - 1]
    //   : undefined;

    // if (lastPoint?.priority === this.lastPrimitivePriority) {
    //   this.points = this.points.slice(0, -1);
    // } else if (lastLine?.priority === this.lastPrimitivePriority) {
    //   if (lastLine.geometry.length > 10) {
    //     lastLine.geometry = lastLine.geometry.slice(0, -10);
    //   } else {
    //     this.lines = this.lines.slice(0, -1);
    //   }
    // }

    // lastPoint = this.points.length
    //   ? this.points[this.points.length - 1]
    //   : undefined;

    // lastLine = this.lines.length
    //   ? this.lines[this.lines.length - 1]
    //   : undefined;

    // this.lastPrimitivePriority =
    //   Math.max(lastLine?.priority | 0, lastPoint?.priority | 0) + 1;

    // this.resortPrimitives();

    // this.redraw();
  }

  public resortPrimitives() {
    this.primitivesSorted = [...this.primitives].sort((a, b) => {
      return a.priority - b.priority;
    });
  }

  public redraw() {
    const { ctx } = this;

    ctx.resetTransform();

    ctx.translate(...this.pivotPoint);
    ctx.scale(this.scale, this.scale);

    this.clear();

    this.primitivesSorted.forEach((p) => {
      if (p.name === "Line") {
        const { geometry, description } = p as GLine;

        ctx.lineJoin = "bevel";
        ctx.lineWidth = description.thickness;
        ctx.strokeStyle = description.color;

        for (const lineSegment of geometry) {
          ctx.beginPath();
          ctx.moveTo(lineSegment[0][0], lineSegment[0][1]);
          lineSegment.slice(1).forEach((point) => {
            ctx.lineTo(...point);
          });

          ctx.stroke();
        }
      } else if (p.name == "Point") {
        const { geometry, description } = p as GPoint;
        ctx.fillStyle = description.color;

        const pointSize = 2;

        // draw points
        ctx.fillRect(
          (geometry[0] - pointSize / 2) | 0,
          (geometry[1] - pointSize / 2) | 0,
          pointSize,
          pointSize
        );
      }
    });
  }

  public clear() {
    const from = this.screenCoordsToCanvasCoords(0, 0);
    const to = this.screenCoordsToCanvasCoords(
      this.canvas.width,
      this.canvas.height
    );

    this.ctx.fillStyle = "black";
    this.ctx.clearRect(...from, to[0] - from[0], to[1] - from[1]);

    // this.ctx.clearRect(...from, ...to);
  }

  public updateScaleAtPoint(atPoint: [number, number], deltaY: number) {
    const prevPoint = this.screenCoordsToCanvasCoords(...atPoint);

    this.scale = this.scale * 10 ** (deltaY / 10000);

    const nextPoint = this.screenCoordsToCanvasCoords(...atPoint);

    const delta = [
      (nextPoint[0] - prevPoint[0]) * this.scale,
      (nextPoint[1] - prevPoint[1]) * this.scale,
    ];

    this.pivotPoint = [
      this.pivotPoint[0] + delta[0],
      this.pivotPoint[1] + delta[1],
    ];

    this.redraw();
  }
}
