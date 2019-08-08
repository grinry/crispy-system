// export class Quaternion {
//   constructor(public w: number = 0, public x: number = 0, public y: number = 0, public z: number = 0) {
//     console.log(w);
//   }
// }
//
declare module 'quaternion' {
  export class Quaternion {
    public w: number;
    public x: number;
    public y: number;
    public z: number;
    public constructor(w: number, x: number, y: number, z: number);
    public static ZERO: Quaternion;
    public static ONE: Quaternion;
    public  static I: Quaternion;
    public static J: Quaternion;
    public static K: Quaternion;
    public static EPSILON: number;
    /**
     * Creates quaternion by a rotation given as axis and angle
     *
     * @param {Array} axis The axis around which to rotate
     * @param {number} angle The angle in radians
     * @returns {Quaternion}
     */
    public static fromAxisAngle(axis: number[], angle: number): Quaternion;
    /**
     * Calculates the quaternion to rotate one vector onto the other
     *
     * @param {Array} u
     * @param {Array} v
     */
    public static fromBetweenVectors(u: number[], v: number[]): Quaternion;
    /**
     * Creates a quaternion by a rotation given by Euler angles
     *
     * @param {number} phi
     * @param {number} theta
     * @param {number} psi
     * @param {string=} order
     * @returns {Quaternion}
     */
    public static fromEuler(phi: number, theta: number, psi: number, order?: string): Quaternion;
    public normalize(): Quaternion;
    /**
     * Gets the actual quaternion as a 4D vector / array
     *
     * @returns {Array}
     */
    public toVector(): number[];
    /**
     * Rotates a vector according to the current quaternion
     *
     * @param {Array} v The vector to be rotated
     * @returns {Array}
     */
    public rotateVector(v: number[]): number[];
    /**
     * Clones the actual object
     *
     * @returns {Quaternion}
     */
    public clone(): Quaternion;
    public slerp(w: number, x: number, y: number, z: number): (pct: number) => Quaternion;
    public real(): number;
    public toString(): string;
    public isNaN(): boolean;
    public isFinite(): boolean;
  }
}
