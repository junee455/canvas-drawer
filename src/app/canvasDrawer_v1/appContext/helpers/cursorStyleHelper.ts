import { Point2 } from "@/lib/math";

export function updateCursorPositioin(cursorEl: HTMLElement, position: Point2) {
  cursorEl.style.top = `${position[1]}px`;
  cursorEl.style.left = `${position[0]}px`;
}

export function updateCursorScale(
  cursorEl: HTMLElement,
  brushSize: number,
  canvasScale: number
) {
  cursorEl.style.setProperty(
    "--brushSize",
    `${(canvasScale * brushSize) / 2}px`
  );
}
