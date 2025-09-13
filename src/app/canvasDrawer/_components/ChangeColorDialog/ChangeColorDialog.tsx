"use client";

import { useEffect, useRef, useState } from "react";
import "./ChangeColorDialog.scss";

export function ChangeColorDialog(props: {
  color?: string;
  onChange?: (c: string) => void;
}) {
  const { color: pColor, onChange } = props;

  const [color, setColor] = useState(pColor || "#ffffff");

  useEffect(() => {
    if (pColor !== color && !!pColor) {
      setColor(pColor);
    }
  }, [pColor, color]);

  const openColorChangeDialog = () => {
    if (!colorInputElRef?.current) {
      return;
    }

    colorInputElRef.current.focus();
    colorInputElRef.current.click();
  };

  const colorInputElRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        className="ChangeColorDialog"
        onClick={openColorChangeDialog}
        style={{
          backgroundColor: color,
        }}
      >
        <input
          type="color"
          ref={colorInputElRef}
          className="colorInput"
          onChange={(v) => {
            setColor(v.currentTarget.value);
            onChange?.(v.currentTarget.value);
          }}
        />
      </button>
    </>
  );
}
