"use client";

import { useState } from "react";
import {
  RadialMenu,
  RadialMenuItem,
  RadialMenuProps,
} from "./RadialMenu/RadialMenu";

import style from "./RadialMenuTest.module.scss";

export default function RadialMenuTest() {
  const [maxItems, setMaxItems] = useState(1);

  const [menuHidden, setMenuHidden] = useState(true);
  const [menuPosition, setMenuPosition] = useState<[number, number]>();

  const [pickedItem, setPickedItem] = useState<string>();

  const menuItems: RadialMenuProps["items"] = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
  ].map((l, i) => ({
    label: l,
    id: `${i}`,
  }));

  const decMaxItems = () => {
    setMaxItems((p) => Math.max(1, p - 1));
  };
  const incMaxItems = () => {
    setMaxItems((p) => Math.min(menuItems.length, p + 1));
  };

  const onHover = (item: RadialMenuItem) => {
    console.log("HOVER: ", item);
  };

  const onPick = (item: RadialMenuItem) => {
    console.log("PICK: ", item);
  };

  return (
    <div
      className={style["RadialMenuTest-page"]}
      onContextMenu={(ev) => {
        ev.preventDefault();

        setMenuHidden(false);
        setMenuPosition([ev.clientX, ev.clientY]);
      }}
    >
      <div>Right-click to open menu</div>
      <div className={style.flex}>
        <button onClick={decMaxItems}>Less items</button>
        <div>{maxItems}</div>
        <button onClick={incMaxItems}>More items</button>
      </div>

      {pickedItem === undefined && <div>No item picked</div>}
      {pickedItem !== undefined && <div>Picked item: {pickedItem}</div>}

      <RadialMenu
        className={style.RadialMenu}
        hidden={menuHidden}
        onPick={(item) => {
          setPickedItem(item.label);
          setMenuHidden(true);
        }}
        items={menuItems.slice(0, maxItems)}
        absolutePosition={menuPosition}
      />
    </div>
  );
}
