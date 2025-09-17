import { BasicTool, KnownTools } from "@/lib/canvasDrawer/core/tools";
import React from "react";
import { LineToolSettings } from "../../_components/ToolsSettings";

export function getToolDescription(toolName: string) {
  const descriptions: {
    [key: KnownTools["constructor"]["name"]]: {
      label: string;
      settingsDialog?: () => React.JSX.Element;
      description: string;
    };
  } = {
    LineTool: {
      label: "Line",
      settingsDialog: LineToolSettings,
      description: "",
    },
    PointTool: {
      label: "Point",
      description: "",
    },
    ErazerTool: {
      label: "Erazer",
      description: "",
    },
  };

  return descriptions[toolName];
}
