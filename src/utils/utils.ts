import { Quaternion } from "quaternion";

export interface KeyValue<T> {
  [key: string]: T;
}

export class Transform {
  public rotation: Quaternion = new Quaternion();
  public position: Vector3 = new Vector3();
}


export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}
  public set(x: number = 0, y: number = 0): void {
    this.x = x;
    this.y = y;
  }
}

export class Vector3 {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}
  public set(x: number = 0, y: number = 0, z: number = 0): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}


export class Player {
  public position: Vector3 = new Vector3();
  public entity: string;
  constructor(public id: string) {}
}
