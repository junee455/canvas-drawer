import { Line, Point2 } from "./primitives";

export type TGraphicPrimitive<
  Name extends KnownPrimitiveNames,
  GeometryType,
  DescriptionType = undefined
> = {
  name: Name;
  geometry: GeometryType;
  description: DescriptionType;
  priority: number;
};

export type WithColorDescription = {
  color: string;
};

export type WithThickness = {
  thickness: number;
};

export type LineDescription = WithColorDescription & WithThickness;
export type PointDescription = WithColorDescription;

export type GLine = TGraphicPrimitive<"Line", Line[], LineDescription>;
export type GPoint = TGraphicPrimitive<"Point", Point2, PointDescription>;

export type KnownPrimitives = GLine | GPoint;
export type KnownPrimitiveNames = KnownPrimitives["name"];
