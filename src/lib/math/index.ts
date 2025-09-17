export type Point2 = [number, number];
export type Point3 = [number, number, number];

export function vecLen(vec: number[]) {
  const squares = vec.reduce((prev, curr) => prev + curr * curr, 0);
  return Math.sqrt(squares);
}

export function dot(a: number[], b: number[]) {
  let dotProduct = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
  }

  return dotProduct;
}

export function matrix2_Det(matrix: [number, number, number, number]) {
  return matrix[0] * matrix[3] - matrix[1] * matrix[2];
}

export function matrix2_Inverse(matrix: [number, number, number, number]) {}

export function cross3(a: Point3, b: Point3): Point3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function cross2(a: Point2, b: Point2) {
  return cross3([...a, 0], [...b, 0]);
}

export function vec2Add(a: Point2, b: Point2): Point2 {
  return [a[0] + b[0], a[1] + b[1]];
}

export function vec2Sub(a: Point2, b: Point2): Point2 {
  return [a[0] - b[0], a[1] - b[1]];
}

export function normalize<T extends number[]>(vec: T) {
  const len = vecLen(vec);
  const newVec: T = [] as unknown as T;

  vec.forEach((component) => {
    newVec.push(component / len);
  });

  return newVec;
}

export function vec2RotateRad(vector: Point2, angle: number): Point2 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return [vector[0] * cos - vector[1] * sin, vector[0] * sin + vector[1] * cos];
}

const RAD = 180 / Math.PI;

const RAD360 = 360 / RAD;

export function radToDeg(angle: number): number {
  return angle * RAD;
}

export function degToRad(angle: number): number {
  return angle / RAD;
}

export function vec2FindAngleRad(a: Point2, b: Point2): number {
  const aNorm = normalize(a);
  const bNorm = normalize(b);

  const dotProduct = dot(aNorm, bNorm);

  const angle = Math.acos(dotProduct);
  let direction = Math.sign(cross2(aNorm, bNorm)[2]);

  direction = direction === 0 ? 1 : direction;

  const res = (angle * direction + RAD360) % RAD360;

  return res;
}
