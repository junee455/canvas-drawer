import { CanvasDrawer } from "@/lib/canvasDrawer/core/canvasDrawer";
import { Point2 } from "@/lib/math";

export class CanvasDragScale {
  private dragScalePivot?: Point2;

  constructor(private canvasDrawer: CanvasDrawer) {}

  public get initiated(): boolean {
    return !!this.dragScalePivot;
  }

  public startScaling(pivot: Point2) {
    this.dragScalePivot = pivot;
  }

  // the smaller the zoom scale - the slower the scaling is
  public updateScale(dScale: number) {
    if (!this.dragScalePivot) {
      return;
    }

    this.canvasDrawer.updateScaleAtPoint(this.dragScalePivot, dScale);
  }

  public finishScaling() {
    this.dragScalePivot = undefined;
  }
}
