import { CSSProperties } from "react";
import style from "./RadialMenu.module.scss";

export type RadialMenuProps = {
  items: {
    label: string;
    id: string;
  }[];
  hints?: boolean;
};

export function RadialMenu(props: RadialMenuProps) {
  const { items, hints = true } = props;

  const itemMinAngle = 360 / 6;

  const generateRotateStyle = (index: number, maxItems: number) => {
    if (maxItems < 6) {
      maxItems = 6;
    }

    // let baseStyle: CSSProperties = {
    // transform:
    // }

    let transformString = "";

    if (index == 0) {
      transformString = "translateY(-50%) translateY(-50px)";
    }
    if (index == maxItems / 2) {
      transformString = "translateY(-50%) translateY(50px)";
    }

    return {
      transform: transformString,
    } as CSSProperties;
  };

  return (
    <div className={style.RadialMenu}>
      {items.map((item, i) => (
        <button key={item.id} style={generateRotateStyle(i, items.length)}>
          {item.label} {i}
        </button>
      ))}
    </div>
  );
}
