import "./index.scss";

import { Point2, Line } from "../../lib/CanvasDrawer/primitives";

import { CanvasDrawer } from "./core/canvasDrawer";

import {
  Tool,
  LineTool,
  PointTool,
  ErazerTool,
  ColorPickerTool,
} from "./core/tools";

window.addEventListener("DOMContentLoaded", () => {
  let drawing = false;

  let prevPoint: Point2 | undefined;
  let distancePassed = 0;

  const drawerElement = document.body;

  const mainCanvasEl = document.getElementById(
    "mainCanvas"
  ) as HTMLCanvasElement | null;

  if (!mainCanvasEl) {
    return;
  }

  let canvasDrawer = new CanvasDrawer(mainCanvasEl);

  let currentTool: Tool | undefined;

  let previousListeners: Tool | undefined;

  let customCursorEl = document.getElementById("cursor");

  // init shortcuts

  document.addEventListener("keydown", (ev) => {
    const { code, key, ctrlKey } = ev;

    if (code !== "F12") {
      ev.preventDefault();
      ev.stopPropagation();
    }

    if (code == "KeyZ" && ctrlKey) {
      canvasDrawer.removeLast();
    }

    // console.log(ev.code, ev.key);
  });

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

      let modifiersPressed = ev.shiftKey || ev.ctrlKey || ev.altKey;

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

  function addTools() {
    const tools = [
      {
        label: "point",
        tool: new PointTool(canvasDrawer),
      },
      {
        label: "line",
        tool: new LineTool(canvasDrawer),
      },
      {
        label: "erazer",
        tool: new ErazerTool(canvasDrawer),
      },
    ];

    // const toolsSettings = [

    // ]

    const toolbarEl = document.getElementById("toolbar");

    function switchTool(tool: Tool) {
      if (previousListeners) {
        // remove all previous event listeners

        if (previousListeners.onMouseDown) {
          drawerElement.removeEventListener(
            "mousedown",
            previousListeners.onMouseDown
          );
        }

        if (previousListeners.onMouseUp) {
          drawerElement.removeEventListener(
            "mouseup",
            previousListeners.onMouseUp
          );
        }

        if (previousListeners.onMouseMove) {
          drawerElement.removeEventListener(
            "mousemove",
            previousListeners.onMouseMove
          );
        }
      }

      currentTool = tool;

      previousListeners = {};

      if (currentTool.onMouseDown) {
        previousListeners.onMouseDown =
          currentTool.onMouseDown.bind(currentTool);

        drawerElement.addEventListener(
          "mousedown",
          previousListeners.onMouseDown!
        );
      }

      if (currentTool.onMouseUp) {
        previousListeners.onMouseUp = currentTool.onMouseUp.bind(currentTool);

        drawerElement.addEventListener("mouseup", previousListeners.onMouseUp!);
      }

      if (currentTool.onMouseMove) {
        previousListeners.onMouseMove =
          currentTool.onMouseMove.bind(currentTool);

        drawerElement.addEventListener(
          "mousemove",
          previousListeners.onMouseMove!
        );
      }
    }

    if (!toolbarEl) {
      return;
    }

    tools.forEach((buttonSettings) => {
      const button = document.createElement("button");
      button.innerHTML = buttonSettings.label;

      button.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      });

      button.addEventListener("click", () => {
        switchTool(buttonSettings.tool);

        Array.from(toolbarEl.children).forEach((toolButton) => {
          (toolButton as HTMLElement).style.backgroundColor = "white";
        });

        button.style.backgroundColor = "lightgreen";
      });

      toolbarEl.appendChild(button);
    });
  }

  addTools();
});
