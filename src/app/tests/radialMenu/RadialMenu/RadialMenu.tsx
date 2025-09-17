import React, { CSSProperties, useRef, useState } from "react";
import style from "./RadialMenu.module.scss";
import { Point2 } from "@/lib/math";
import {
  radToDeg,
  vec2FindAngleRad as vec2FindAngleRad,
  vec2Sub,
} from "@/lib/math";
import { objToClass } from "@/lib/utils";

export type RadialMenuItem = {
  label: string;
  id: string;
};

export type RadialMenuProps = {
  items: RadialMenuItem[];
  hints?: boolean;
  hidden?: boolean;
  onHover?: (item: RadialMenuItem) => void;
  onPick?: (item: RadialMenuItem) => void;
  className?: string;
  absolutePosition?: [number, number];
};

export function RadialMenu(props: RadialMenuProps) {
  const {
    items,
    hints = true,
    hidden = false,
    onHover,
    onPick,
    absolutePosition: absolutePosition,
    className: styleOverride = "",
  } = props;

  const [highlightedItem, setHighlightedItem] = useState<RadialMenuItem>();

  const [indicatorAngle, setIndicatorAngle] = useState(0);

  const itemMaxAngle = 360 / 6;

  const maxItems = Math.max(6, items.length);

  const generateRotateStyle = (index: number) => {
    let transformString = "";

    const menuRadius = 100;

    const bottomItems = Math.abs(index - maxItems / 2) < 1;

    if (index == 0) {
      transformString = `translateY(-50%) translateX(-50%) translateY(-${menuRadius}px)`;
    } else if (bottomItems && !(maxItems % 2)) {
      transformString = `translateY(-50%) translateX(-50%) translateY(${menuRadius}px)`;
    } else {
      const rotateDegrees = 180 - (360 / maxItems) * index;

      let isOnLeftSize = true;

      if (index > maxItems / 2) {
        isOnLeftSize = false;
      }
      const translateX = isOnLeftSize ? -100 : 0;

      transformString = `translateY(-50%) translateX(${translateX}%) rotate(${rotateDegrees}deg) translateY(${menuRadius}px) rotate(${-rotateDegrees}deg)`;
    }

    return {
      transform: transformString,
    } as CSSProperties;
  };

  const centerElRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (clientX: number, clientY: number) => {
    if (!centerElRef.current) {
      return;
    }

    const { top, left, width, height } = (
      centerElRef.current as HTMLDivElement
    ).getBoundingClientRect();

    const cursorPos: Point2 = [clientX, clientY];

    const centerPos: Point2 = [left + width / 2, top + height / 2];

    let pointerAngle = radToDeg(
      vec2FindAngleRad(vec2Sub(cursorPos, centerPos), [0, -1])
    );

    setIndicatorAngle(pointerAngle);

    const degPerSector = 360 / maxItems;

    pointerAngle = (pointerAngle + 360 + degPerSector / 2) % 360;

    const sectorIndex = (pointerAngle / degPerSector) | 0;

    let newHighlightedItem: RadialMenuItem | undefined = undefined;

    if (sectorIndex < items.length) {
      newHighlightedItem = items[sectorIndex];

      if (newHighlightedItem !== highlightedItem) {
        onHover?.(newHighlightedItem);
      }
    }

    setHighlightedItem(newHighlightedItem);

    return newHighlightedItem;
  };

  const onClick = (ev: React.MouseEvent) => {
    const newHighlightedItem = onPointerMove(ev.clientX, ev.clientY);

    if (newHighlightedItem) {
      onPick?.(newHighlightedItem);
    }
  };

  const absolutePositionStyle: CSSProperties = {
    position: absolutePosition ? "fixed" : "relative",
    top: `${absolutePosition?.[1]}px`,
    left: `${absolutePosition?.[0]}px`,
    transform: "translate(-50%, -50%)",
  };

  return (
    <div
      className={[style.RadialMenu, styleOverride].filter((v) => !!v).join(" ")}
      style={{
        visibility: hidden ? "hidden" : "visible",
        ...(absolutePosition ? absolutePositionStyle : {}),
      }}
      onPointerMove={(ev) => onPointerMove(ev.clientX, ev.clientY)}
      onClick={onClick}
    >
      <div ref={centerElRef} className={style.center}>
        <div
          className={style.indicator}
          style={{
            transform: `rotate(${-indicatorAngle}deg) translateY(-11px)`,
          }}
        ></div>
      </div>
      {items.map((item, i) => (
        <button
          key={item.id}
          style={generateRotateStyle(i)}
          className={objToClass({
            [style.hover]: item == highlightedItem,
          })}
        >
          {item.label} {i}
        </button>
      ))}
    </div>
  );
}
