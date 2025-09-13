import { CanvasDrawer } from "../canvasDrawer";

export interface Tool {
  onMouseMove?: (ev: MouseEvent) => void;
  onMouseDown?: (ev: MouseEvent) => void;
  onMouseUp?: (ev: MouseEvent) => void;
}

export abstract class BasicTool implements Tool {
  constructor(protected canvas: CanvasDrawer) {}

  onMouseMove(ev: MouseEvent) {}
  onMouseDown(ev: MouseEvent) {}
  onMouseUp(ev: MouseEvent) {}
}
