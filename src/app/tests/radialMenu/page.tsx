import { RadialMenu, RadialMenuProps } from "./RadialMenu/RadialMenu";

export default function RadialMenuTest() {
  const menuItems: RadialMenuProps["items"] = ["one", "two", "three"].map(
    (l, i) => ({
      label: l,
      id: `${i}`,
    })
  );

  return (
    <div style={{
      position: "relative",
      display: "block",
      width: "100%",
      height: "100%"
    }}>
      <RadialMenu items={menuItems} />
    </div>
  );
}
