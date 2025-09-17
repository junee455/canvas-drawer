import { CanvasDrawer } from "@/lib/canvasDrawer/core/canvasDrawer";
import { Point2 } from "@/lib/math";

export function wheelScaleAtPoint(
  atPoint: Point2,
  dScale: number,
  canvasDrawer: CanvasDrawer
) {
  canvasDrawer.updateScaleAtPoint(atPoint, dScale);
}
