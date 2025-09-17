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
  BasicTool,
  ErazerTool,
  LineTool,
  lineToolDefaultSettings,
  PointTool,
} from "@/lib/canvasDrawer/core/tools";
import { ChangeColorDialog, Modal } from "./_components";
import { CanvasDrawerAppContext, initApp } from "./appContext";
import { getToolDescription } from "./appContext/helpers";
import { LineToolSettings } from "./_components/ToolsSettings/LineToolSettings/LineToolSettings";

export default function CanvasDrawerPage() {
  const canvasElRef = useRef<HTMLCanvasElement>(null);

  const customCursorElRef = useRef<HTMLDivElement>(null);

  const cursorWidgetsElRef = useRef<HTMLDivElement>(null);

  const pageRootElRef = useRef<HTMLDivElement>(null);

  const [canvasDrawer, setCanvasDrawer] = useState<CanvasDrawer>();

  const [canvasScale, setCanvasScale] = useState(1);

  const [brushSize, setBrushSize] = useState(2);

  const [appContext, setAppContext] = useState<CanvasDrawerAppContext>();

  const [cursorPosition, setCursorPosition] = useState<[number, number]>([
    0, 0,
  ]);

  const [canvasModalPosition, setCanvasModalPosition] =
    useState<[number, number]>();

  const [modalToShow, setModalToShow] = useState<"tools" | "toolSettings">();

  const canvasModalShown = !!canvasModalPosition;

  type LineToolSettings = {
    color: string;
  };

  const [lineToolSettings, setLineToolSettings] = useState<LineToolSettings>(
    lineToolDefaultSettings
  );

  const [tools, setTools] = useState<
    {
      label: string;
      settingsDialog?: () => React.JSX.Element;
      tool: BasicTool;
    }[]
  >([]);

  const [currentTool, setCurrentTool] = useState<{
    label: string;
    tool: BasicTool;
  }>();

  const [showTools, setShowTools] = useState(true);
  const [showToolSettings, setShowToolSettings] = useState(true);

  const [showCursorWidget, setShowCursorWidget] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!canvasElRef.current || !customCursorElRef.current) {
        console.log("no canvas element");
      }

      const newAppContext = initApp(canvasElRef.current as HTMLCanvasElement, {
        customCursorEl: customCursorElRef.current as HTMLElement,
      });

      setAppContext(newAppContext);

      const toolButtons = newAppContext.tools.map((t) => {
        const toolDescription = getToolDescription(t.constructor.name);

        return {
          label: toolDescription.label,
          settingsDialog: toolDescription.settingsDialog,
          tool: t,
        };
      });

      toolButtons.forEach((t) => {
        console.log(typeof t.tool);
      });

      setTools(toolButtons);
    }, 100);
  }, []);

  useEffect(() => {
    console.log(currentTool, lineToolSettings);

    if (!(currentTool?.tool instanceof LineTool)) {
      return;
    }

    currentTool.tool.updateSettings(lineToolSettings);
  }, [lineToolSettings, currentTool]);

  const onKeyDown = (_ev: React.KeyboardEvent) => {
    if (!appContext) {
      return;
    }

    const ev = _ev.nativeEvent;

    const { canvasDrawer } = appContext;

    if (ev.code === "KeyZ" && ev.ctrlKey) {
      canvasDrawer.removeLast();
    }

    if (ev.code === "KeyF") {
      setModalToShow("tools");

      setCanvasModalPosition(appContext.cursorPosition);
    }

    if (ev.code === "Space") {
      console.log("space bar");
    }

    // console.log(ev.key);
  };

  return (
    <div
      className="CanvasDrawer-page"
      tabIndex={0}
      ref={pageRootElRef}
      onKeyDown={onKeyDown}
      onPointerDown={() => {
        setCanvasModalPosition(undefined);
      }}
    >
      <div className="canvasContainer">
        <canvas ref={canvasElRef} />
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
          tools.map((t, i) => (
            <button
              key={`${i}-${t.label}`}
              onClick={() => {
                if (appContext?.pickCurrentTool(t.tool)) {
                  setCurrentTool(t);
                }
              }}
              className={objToClass({
                active: currentTool === t,
              })}
            >
              {t.label}
            </button>
          ))}
      </div>

      <div
        className={objToClass({
          toolSettings: true,
          semiHidden: !showToolSettings,
        })}
      >
        <button
          onClick={() => {
            setShowToolSettings((p) => !p);
          }}
        >
          {showToolSettings ? "❱" : "❰"}
        </button>
        {showToolSettings && (
          <>
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

      <Modal
        shown={canvasModalShown}
        position={canvasModalPosition}
        className="ToolListModal"
      >
        {modalToShow === "tools" &&
          tools.map((t, i) => {
            return (
              <button
                onPointerDown={(ev) => {
                  console.log("click modal");

                  ev.stopPropagation();
                  ev.preventDefault();

                  appContext?.pickCurrentTool(t.tool);
                  setCurrentTool(t);

                  setCanvasModalPosition(undefined);

                  pageRootElRef.current?.focus();
                }}
                key={i}
              >
                {t.label}
              </button>
            );
          })}
      </Modal>
    </div>
  );
}
