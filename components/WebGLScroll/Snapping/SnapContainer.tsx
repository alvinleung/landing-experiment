import React, { MutableRefObject, useEffect, useRef } from 'react'
import { useVirtualScroll } from '../VirtualScroll';
import { createSnapPoint, updateSnapPoint } from './SnapPoint';

type Props = {}

const SnapContainer = ({ children }: React.PropsWithChildren<Props>) => {
  const elmRef = useRef() as MutableRefObject<HTMLDivElement>;
  const { addSnapPoint, removeSnapPoint } = useVirtualScroll();
  useEffect(() => {
    const elm = elmRef.current;
    if (!elm) return;

    const snapPoint = createSnapPoint(elm)
    addSnapPoint(snapPoint);

    const handleResize = () => {
      updateSnapPoint(snapPoint);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      removeSnapPoint(snapPoint);
    }
  }, [elmRef])
  return (
    <div ref={elmRef}>{
      children
    }</div>
  )
}

export default SnapContainer
