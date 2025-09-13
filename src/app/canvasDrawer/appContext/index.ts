import { CanvasDrawer } from "@/lib/canvasDrawer/core/canvasDrawer";
import { Point2 } from "@/lib/canvasDrawer/core/primitives";
import {
  PointTool,
  LineTool,
  ErazerTool,
  Tool,
  BasicTool,
} from "@/lib/canvasDrawer/core/tools";

import * as Helpers from "./helpers";

type AppContext = {
  canvasDrawer: CanvasDrawer;
  canvas: HTMLCanvasElement;
  cursorPosition: Point2;
  tools: BasicTool[];

  destroy: () => void;

  currentTool?: Tool;
  pickCurrentTool: (t: Tool) => boolean;
};

export function initApp(
  canvasEl: HTMLCanvasElement,
  conf?: {
    onScaleChange?: (scale: number) => void;
    onPointerMove?: (ev: PointerEvent) => void;
    onPointerDown?: (ev: PointerEvent) => void;
    onPointerUp?: (ev: PointerEvent) => void;
    onKeyDown?: (ev: KeyboardEvent) => void;
    onKeyUp?: (ev: KeyboardEvent) => void;

    customCursorEl?: HTMLElement;
  }
): AppContext {
  const { customCursorEl } = conf || {};

  const canvasDrawer = new CanvasDrawer(canvasEl);

  const pointTool = new PointTool(canvasDrawer);

  const lineTool = new LineTool(canvasDrawer);

  const erazerTool = new ErazerTool(canvasDrawer);

  function onPointerUp(ev: PointerEvent) {}

  function onPointerDown(ev: PointerEvent) {}

  function onPointerMove(ev: PointerEvent) {
    if (customCursorEl) {
      const newPosition: Point2 = [ev.clientX, ev.clientY];
      Helpers.updateCursorPositioin(customCursorEl, newPosition);
    }
  }

  function onKeyUp(ev: KeyboardEvent) {}

  function onKeyDown(ev: KeyboardEvent) {}

  const appContext: AppContext = {
    canvasDrawer,
    canvas: canvasEl,
    cursorPosition: [0, 0],
    tools: [lineTool, pointTool, erazerTool],
    destroy: onDestroy,

    pickCurrentTool,
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerup", onPointerUp);

  function onMouseLeave() {
    customCursorEl!.style.display = "none";
  }

  function onMouseEnter() {
    customCursorEl!.style.display = "block";
  }

  let withCustomCursoreEl = false;

  if (customCursorEl) {
    withCustomCursoreEl = true;

    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
  }

  function onDestroy() {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    document.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);

    if (withCustomCursoreEl) {
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    }
  }

  function pickCurrentTool(t: Tool) {
    if (!appContext.tools.includes(t)) {
      return false;
    }

    appContext.currentTool = t;
    return true;
  }

  return appContext;
}

function init_old() {
  const newDrawer = new CanvasDrawer(canvasElRef.current!, {
    onScaleChange: (newScale) => setCanvasScale(newScale),
  });

  setCanvasDrawer(newDrawer);

  const pointTool = new PointTool(newDrawer);

  const lineTool = new LineTool(newDrawer);

  const erazerTool = new ErazerTool(newDrawer);
  // init tools
  const tools = [
    {
      label: "point",
      tool: pointTool,
    },
    {
      label: "line",
      tool: lineTool,
    },
    {
      label: "erazer",
      tool: erazerTool,
    },
  ];

  let _brushSize = 2;

  document.addEventListener("wheel", (ev) => {
    if (!!ev.ctrlKey || !!ev.altKey || !!ev.shiftKey) {
      return;
    }

    let delta = ev.deltaY / 100;

    if (_brushSize <= 1) {
      delta /= 10;
    }

    const newBrushSize = Math.max(0.1, _brushSize + delta);

    setBrushSize(newBrushSize);

    _brushSize = newBrushSize;

    tools.forEach((t) => {
      if (t.tool instanceof LineTool) {
        t.tool.thickness = newBrushSize;
      }
    });
  });

  setTools(tools);

  const customCursorEl = customCursorElRef.current as HTMLDivElement;

  if (customCursorEl) {
    document.addEventListener("mouseleave", () => {
      customCursorEl.style.display = "none";
    });

    document.addEventListener("mouseenter", () => {
      customCursorEl.style.display = "block";
    });

    document.addEventListener("mousemove", (ev) => {
      customCursorEl.style.top = `${ev.clientY}px`;
      customCursorEl.style.left = `${ev.clientX}px`;

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
        customCursorEl.style.display = "none";
      } else {
        customCursorEl.style.display = "block";
      }
    });

    document.addEventListener("mouseup", () => {
      customCursorEl.style.display = "block";
    });
  }

  document.addEventListener("keydown", (ev) => {
    const { code, key, ctrlKey } = ev;

    console.log(ev.code, ev.ctrlKey, ev.shiftKey, ev.altKey);

    type ShortcutDescription = {
      key: string;
      ctrl?: boolean;
      shift?: boolean;
      alt?: boolean;
    };

    const permittedShortcuts: ShortcutDescription[] = [
      {
        key: "F12",
      },
      {
        key: "F11",
      },
      {
        key: "KeyS",
        ctrl: true,
      },
    ];

    let shouldPrevent = true;

    permittedShortcuts.forEach((s) => {
      const match = [
        !!s.ctrl == ev.ctrlKey,
        !!s.shift == ev.shiftKey,
        !!s.alt == ev.altKey,
        s.key === ev.code,
      ].every((v) => v === true);

      if (match) {
        shouldPrevent = false;
      }
    });

    if (!shouldPrevent) {
      return;
    }

    // process known shortcuts

    type ShortcutMap = [ShortcutDescription, () => void][];

    const knownShortcuts: ShortcutMap = [
      [
        {
          key: "Digit1",
        },
        () => setCurrentTool(tools[1]),
      ],
      [
        {
          key: "Digit2",
        },
        () => setCurrentTool(tools[2]),
      ],
      [
        {
          key: "KeyZ",
          ctrl: true,
        },
        () => newDrawer.removeLast(),
      ],
      [
        {
          key: "KeyF",
        },
        () => {
          setShowCursorWidget(true);
        },
      ],
    ];

    const isKeypressMatches = (ev: KeyboardEvent, s: ShortcutDescription) => {
      const match = [
        !!s.ctrl == ev.ctrlKey,
        !!s.shift == ev.shiftKey,
        !!s.alt == ev.altKey,
        s.key === ev.code,
      ].every((v) => v === true);

      return match;
    };

    for (const shortCut of knownShortcuts) {
      if (isKeypressMatches(ev, shortCut[0])) {
        shortCut[1]();
        break;
      }
    }
  });
}
