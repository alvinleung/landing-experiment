import CleanupProtocol from "cleanup-protocol";
import { PlaneObject } from "./PlaneObject";
import { OGLRenderingContext, Transform } from "ogl";
import { ScrollCanvasRenderingInfo } from "./ScrollCanvas";

export class PlaneObjectList implements CleanupProtocol {
  private _planes: PlaneObject[] = [];
  public static empty = new PlaneObjectList();

  create() {
    const plane = new PlaneObject();
    this._planes.push(plane);

    return plane;
  }

  update(
    gl: OGLRenderingContext,
    scene: Transform,
    info: ScrollCanvasRenderingInfo
  ) {
    for (let i = 0; i < this._planes.length; i++) {
      this._planes[i].update(gl, scene, info);
    }
  }
  delete(plane: PlaneObject) {
    plane.cleanup();
    const index = this._planes.findIndex((item) => item === plane);
    if (index === -1) return; // item not found on the list
    this._planes.splice(index, 1);
  }

  cleanup(): void {
    // deinit all planes
    this._planes.forEach((plane) => {
      plane.cleanup();
    });
  }
}
