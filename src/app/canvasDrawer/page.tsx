"use client";

import { CanvasDrawer } from "@/lib/canvasDrawer/core/canvasDrawer";
import React, {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import "./canvasDrawer.scss";
import { objToClass } from "@/lib/utils";
import {
  ErazerTool,
  LineTool,
  lineToolDefaultSettings,
  PointTool,
  Tool,
} from "@/lib/canvasDrawer/core/tools";
import { ChangeColorDialog } from "./_components";
import { initApp } from "./appContext";
import { getToolDescription } from "./appContext/helpers";

export default function CanvasDrawerPage() {
  const canvasElRef = useRef<HTMLCanvasElement>(null);

  const customCursorElRef = useRef<HTMLDivElement>(null);

  const cursorWidgetsElRef = useRef<HTMLDivElement>(null);

  const [canvasDrawer, setCanvasDrawer] = useState<CanvasDrawer>();

  const [canvasScale, setCanvasScale] = useState(1);

  const [brushSize, setBrushSize] = useState(2);

  type LineToolSettings = {
    color: string;
  };

  const [lineToolSettings, setLineToolSettings] = useState<LineToolSettings>(
    lineToolDefaultSettings
  );

  const [tools, setTools] = useState<
    {
      label: string;
      tool: Tool;
    }[]
  >([]);

  const [currentTool, setCurrentTool] = useState<{
    label: string;
    tool: Tool;
  }>();

  const [showTools, setShowTools] = useState(true);

  const [showCursorWidget, setShowCursorWidget] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!canvasElRef.current || !customCursorElRef.current) {
        console.log("no canvas element");
      }

      const appContext = initApp(canvasElRef.current as HTMLCanvasElement, {
        customCursorEl: customCursorElRef.current as HTMLElement,
      });

      // getToolDescription(appContext.tools[0]);
    }, 100);
  }, []);

  useEffect(() => {
    console.log(currentTool, lineToolSettings);

    if (!(currentTool?.tool instanceof LineTool)) {
      return;
    }

    currentTool.tool.updateSettings(lineToolSettings);
  }, [lineToolSettings, currentTool]);

  return (
    <div className="CanvasDrawer-page">
      <div className="canvasContainer">
        <canvas
          ref={canvasElRef}
          onMouseDown={(ev) => {
            currentTool?.tool.onMouseDown?.(ev.nativeEvent);
          }}
          onMouseUp={(ev) => {
            currentTool?.tool.onMouseUp?.(ev.nativeEvent);
          }}
          onPointerMove={(ev) => {
            currentTool?.tool.onMouseMove?.(ev.nativeEvent);
          }}
        />
      </div>

      <div
        className={objToClass({
          tools: true,
          semiHidden: !showTools,
        })}
      >
        <button
          onClick={() => {
            setShowTools((p) => !p);
          }}
        >
          {showTools ? "❰" : "❱"}
        </button>
        {showTools &&
          tools.map((t) => (
            <button
              key={t.label}
              onClick={() => {
                setCurrentTool(t);
              }}
              className={objToClass({
                active: currentTool === t,
              })}
            >
              {t.label}
            </button>
          ))}
      </div>

      <div className="toolSettings">
        {currentTool?.tool instanceof LineTool && (
          <>
            <ChangeColorDialog
              color={lineToolSettings.color}
              onChange={(c) => {
                setLineToolSettings((p) => ({ ...p, ...{ color: c } }));
              }}
            />
          </>
        )}
      </div>

      {showCursorWidget && (
        <div ref={cursorWidgetsElRef} className="cursorWidgets">
          <button>Cursor widget</button>
        </div>
      )}

      <div className="customCursor" ref={customCursorElRef} id="cursor">
        <div className="markCenter"></div>

        <div className="mark left"></div>
        <div className="mark right"></div>
        <div className="mark top"></div>
        <div className="mark bottom"></div>
      </div>
    </div>
  );
}
