// import * as quaternion from 'quaternion';
// import { Vector3 } from "~app/utils/utils";
//
// /**
//  * @link https://gist.github.com/bellbind/1680719
//  */
// export class Quaterniosn {
//   public eulerAngles: Vector3 = new Vector3();
//   constructor(public w: number = 0, public x: number = 0, public y: number = 0, public z: number = 0) {}
//   public set(w: number = 0, x: number = 0, y: number = 0, z: number = 0): void {
//     this.w = w;
//     this.x = x;
//     this.y = y;
//     this.z = z;
//   }
//   public get normalized(): Vector3 {
//     const dist = this.distance;
//     return new Vector3(this.x / dist, this.y / dist, this.z / dist);
//     // return this.vector3Array().map(e => e / dist);
//   }
//
//   public get distance(): number {
//     return Math.sqrt(this.norm());
//   }
//
//   protected norm(): number {
//     return this.vector3Array().reduce((s: number, e: number) => s + e * e, 0);
//   }
//
//   protected vector3Array(): number[] {
//     return [this.x, this.y, this.z];
//   }
//
// //   var norm = function (vec) {
// //     return vec.reduce(function (s, e) {return s + e * e;}, 0);
// //   };
// //   var distance = function (vec) {
// //     return Math.sqrt(norm(vec));
// //   };
// // //[normalize]
// // // for any v, distance(normalize(v)) === 1
// //   var normalize = function (vec) {
// //     var dist = distance(vec);
// //     // assert(dist !== 0);
// //     return vec.map(function (e) {return e / dist;});
// //   };
//   // eulerAngles	Returns or sets the euler angle representation of the rotation.
//   // normalized	Returns this quaternion with a magnitude of 1 (Read Only).
//   // this[int]	Access the x, y, z, w components using [0], [1], [2], [3] respectively.
//   // w	W component of the Quaternion. Do not directly modify quaternions.
//   // x	X component of the Quaternion. Don't modify this directly unless you know quaternions inside out.
//   // y	Y component of the Quaternion. Don't modify this directly unless you know quaternions inside out.
//   // z
// }
