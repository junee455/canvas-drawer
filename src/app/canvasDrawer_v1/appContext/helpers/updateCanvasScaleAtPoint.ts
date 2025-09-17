import { CanvasDrawer } from "@/lib/canvasDrawer/core/canvasDrawer";
import { Point2 } from "@/lib/math";

export function updateScaleAtPoint(
  atPoint: Point2,
  deltaY: number,
  canvasDrawer: CanvasDrawer
) {
  const prevPoint = canvasDrawer.screenCoordsToCanvasCoords(...atPoint);

  canvasDrawer.scale = canvasDrawer.scale * 10 ** (deltaY / 10000);

  const nextPoint = canvasDrawer.screenCoordsToCanvasCoords(...atPoint);

  const delta = [
    (nextPoint[0] - prevPoint[0]) * canvasDrawer.scale,
    (nextPoint[1] - prevPoint[1]) * canvasDrawer.scale,
  ];

  canvasDrawer.pivotPoint = [
    canvasDrawer.pivotPoint[0] + delta[0],
    canvasDrawer.pivotPoint[1] + delta[1],
  ];
}
