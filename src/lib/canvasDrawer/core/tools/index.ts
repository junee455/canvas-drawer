import { ErazerTool } from "./erazerTool";
import { LineTool } from "./lineTool";
import { PointTool } from "./pointTool";

export type KnownTools = ErazerTool | LineTool | PointTool;

export * from "./basicTool";
export * from "./erazerTool";
export * from "./lineTool";
export * from "./pointTool";
export * from "./colorPickerTool";
