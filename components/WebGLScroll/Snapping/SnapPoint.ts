export interface SnapPoint {
  id: string;
  position: number;
  elm: HTMLElement
}

let __snapPointId__ = 0;

export function createSnapPoint(elm: HTMLElement): SnapPoint {
  __snapPointId__++;
  const bounds = elm.getBoundingClientRect();

  return {
    id: `${__snapPointId__}`,
    position: bounds.top,
    elm
  }
}

export function updateSnapPoint(item: SnapPoint) {
  const bounds = item.elm.getBoundingClientRect();
  item.position = bounds.top;
  return item;
}


