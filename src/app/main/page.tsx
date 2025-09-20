"use client";

import style from "./Main.module.scss";

export default function MainPage() {
  const names = "one two three four five".split(" ");

  return (
    <div className={style["Main-page"]}>
      <h1>Main page</h1>

      <div className={style.canvasesGrid}>
        {names.map((n, i) => (
          <div key={i}>
            <div className={style.pictrue}></div>
            <div className={style.cardBottom}>{n}</div>
          </div>
        ))}

        <div className={style.plus}>+</div>
      </div>
    </div>
  );
}
