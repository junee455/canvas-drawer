"use client";

import { PropsWithChildren } from "react";
import style from "./Modal.module.scss";

export type ModalProps = {
  position?: [number, number];
  shown?: boolean;
  className?: string;
} & PropsWithChildren;

export function Modal(props: ModalProps) {
  const { children, className: pClass, shown = false, position } = props;

  if (!shown || !position) {
    return null;
  }

  return (
    <div
      className={[style.Modal, pClass].filter((v) => !!v).join(" ")}
      style={{
        top: `${position[1] - 10}px`,
        left: `${position[0] - 10}px`,
      }}
    >
      {(() => {
        console.log("rerender");
        return null;
      })()}
      {children}
    </div>
  );
}
