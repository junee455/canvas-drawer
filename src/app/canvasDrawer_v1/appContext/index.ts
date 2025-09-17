import { CanvasDrawer } from "@/lib/canvasDrawer/core/canvasDrawer";
import { Point2 } from "@/lib/math";
import {
  PointTool,
  LineTool,
  ErazerTool,
  BasicTool,
} from "@/lib/canvasDrawer/core/tools";

import * as Helpers from "./helpers";
import { dragCanvas } from "./inputHandlers.ts";

type ShortcutDescription = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
};

type ShortcutMap = [ShortcutDescription, () => void][];

export type CanvasDrawerAppContext = {
  canvasDrawer: CanvasDrawer;
  canvas: HTMLCanvasElement;
  cursorPosition: Point2;
  tools: BasicTool[];

  destroy: () => void;

  currentTool?: BasicTool;
  pickCurrentTool: (t: BasicTool) => boolean;
};

export function initApp(
  canvasEl: HTMLCanvasElement,
  conf?: {
    customCursorEl?: HTMLElement;
  }
): CanvasDrawerAppContext {
  const { customCursorEl } = conf || {};

  const canvasDrawer = new CanvasDrawer(canvasEl);

  const pointTool = new PointTool(canvasDrawer);

  const lineTool = new LineTool(canvasDrawer);

  const erazerTool = new ErazerTool(canvasDrawer);

  function onPointerUp(ev: PointerEvent) {
    if (!appContext.currentTool) {
      return;
    }

    const tool = appContext.currentTool;

    if (!tool) {
      return;
    }

    tool.onMouseUp(ev);
  }

  function onPointerDown(ev: PointerEvent) {
    if (!(ev.target == ev.currentTarget && ev.currentTarget == canvasEl)) {
      return;
    }

    const tool = appContext.currentTool;

    if (!tool) {
      return;
    }

    tool.onMouseDown(ev);
  }

  function onPointerMove(ev: PointerEvent) {
    if (customCursorEl) {
      const newPosition: Point2 = [ev.clientX, ev.clientY];
      Helpers.updateCursorPositioin(customCursorEl, newPosition);
    }

    appContext.cursorPosition = [ev.clientX, ev.clientY];

    const tool = appContext.currentTool;

    if (!tool) {
      return;
    }

    tool.onMouseMove(ev);

    // canvas.addEventListener("mousemove", (ev) => {
    // console.log(ev.buttons ^ 4);
    const rightPressed = !(ev.buttons ^ 2);

    if (ev.ctrlKey && rightPressed) {
      // initiate
      if (!canvasDrawer.canvasDragScaleHelper.initiated) {
        canvasDrawer.canvasDragScaleHelper.startScaling([
          ev.clientX,
          ev.clientY,
        ]);
      } else {
        // if initiated:
        let zoomScale = 100;

        if (ev.shiftKey) {
          zoomScale = 10;
        }

        canvasDrawer.canvasDragScaleHelper.updateScale(
          ev.movementY * zoomScale
        );
      }

      if (customCursorEl) {
        Helpers.updateCursorScale(
          customCursorEl,
          lineTool.thickness,
          canvasDrawer.scale
        );
      }
    } else {
      if (canvasDrawer.canvasDragScaleHelper.initiated) {
        canvasDrawer.canvasDragScaleHelper.finishScaling();
      }
    }

    if (!ev.ctrlKey && rightPressed) {
      dragCanvas([ev.movementX, ev.movementY], canvasDrawer);

      canvasDrawer.redraw();
    }
    // });
  }

  function onWheel(ev: WheelEvent) {
    ev.preventDefault();
    ev.stopImmediatePropagation();

    if (ev.ctrlKey) {
      canvasDrawer.updateScaleAtPoint([ev.clientX, ev.clientY], -ev.deltaY);
    } else {
      lineTool.addThickness(-ev.deltaY / 100);
      // lineTool.thickness += ev.deltaY;
      // console.log("update thickness", lineTool.thickness, -ev.deltaY / 100);
    }

    if (customCursorEl) {
      Helpers.updateCursorScale(
        customCursorEl,
        lineTool.thickness,
        canvasDrawer.scale
      );
    }
  }

  function onKeyUp(ev: KeyboardEvent) {}

  function onKeyDown(ev: KeyboardEvent) {}

  const appContext: CanvasDrawerAppContext = {
    canvasDrawer,
    canvas: canvasEl,
    cursorPosition: [0, 0],
    tools: [lineTool, pointTool, erazerTool],

    destroy: onDestroy,

    currentTool: lineTool,

    pickCurrentTool,
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  canvasEl.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("pointermove", onPointerMove);
  canvasEl.addEventListener("pointerup", onPointerUp);
  canvasEl.addEventListener("wheel", onWheel);

  function onMouseLeave() {
    customCursorEl!.style.display = "none";
  }

  function onMouseEnter() {
    customCursorEl!.style.display = "block";
  }

  let withCustomCursoreEl = false;

  if (customCursorEl) {
    withCustomCursoreEl = true;

    canvasEl.addEventListener("mouseleave", onMouseLeave);
    canvasEl.addEventListener("mouseenter", onMouseEnter);
  }

  function onDestroy() {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    canvasEl.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("pointermove", onPointerMove);
    canvasEl.removeEventListener("pointerup", onPointerUp);
    canvasEl.removeEventListener("wheel", onWheel);

    if (withCustomCursoreEl) {
      canvasEl.removeEventListener("mouseleave", onMouseLeave);
      canvasEl.removeEventListener("mouseenter", onMouseEnter);
    }
  }

  function pickCurrentTool(t: BasicTool) {
    if (!appContext.tools.includes(t)) {
      return false;
    }

    canvasDrawer.redraw();
    appContext.currentTool = t;
    return true;
  }

  return appContext;
}
