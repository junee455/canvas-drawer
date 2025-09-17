import { CanvasDrawer } from "@/lib/canvasDrawer/core/canvasDrawer";
import { Point2, vec2Add } from "@/lib/math";

export function dragCanvas(dv: Point2, canvasDrawer: CanvasDrawer) {
  canvasDrawer.pivotPoint = vec2Add(canvasDrawer.pivotPoint, dv);
}
