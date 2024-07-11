import {
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useResizeObserver, useWindowSize } from "usehooks-ts";
import { AnimatedValue } from "./ScrollCanvas/AnimatedValue/AnimatedValue";
import { useAnimatedValue } from "./ScrollCanvas/AnimatedValue/useAnimatedValue";
import { clamp } from "@/utils/clamp";
import { SnapPoint } from "./Snapping/SnapPoint";
import { Status } from "status-hud";
import { debounce } from "@/utils/debounce";

export interface ScrollState {
  current: number;
  target: number;
}

const VirtualScrollContext = createContext({
  scroll: AnimatedValue.empty,
  addSnapPoint: (snapPoint: SnapPoint) => { },
  removeSnapPoint: (snapPoint: SnapPoint) => { },
});

export const useVirtualScroll = () => useContext(VirtualScrollContext);

interface Props {
  contentRef: RefObject<HTMLElement>;
}

export const VirtualScrollProvider = ({
  contentRef,
  children,
}: React.PropsWithChildren<Props>) => {
  const virtualScrollValue = useAnimatedValue();

  const [snapPoints, setSnapPoints] = useState([] as SnapPoint[]);
  const sortedSnapPoints = useMemo(() => {
    return snapPoints.sort((a, b) => a.position - b.position)
  }, [snapPoints])


  const { height: pageHeight } = useResizeObserver({ ref: contentRef });
  const { height: windowHeight } = useWindowSize({
    initializeWithValue: false,
  });

  const maxScroll = useMemo(
    () => Math.max(0, (pageHeight || 0) - (windowHeight || 0)),
    [pageHeight, windowHeight]
  );

  // handle wheel input
  useEffect(() => {
    const MAX_DELTA = 100;
    const SCROLL_STOP_DEBOUNCE = 100;

    const stopScrollingDebounced = debounce(() => {
      snaptToNearest(virtualScrollValue, snapPoints)
    }, SCROLL_STOP_DEBOUNCE);

    const handleWheel = (e: WheelEvent) => {
      const delta = -clamp(e.deltaY, -MAX_DELTA, MAX_DELTA);
      const newPos = virtualScrollValue.getTarget() + delta * 2;
      const clampedPos = clamp(newPos, -maxScroll, 0);
      virtualScrollValue.lerpTo(clampedPos, 0.24);

      stopScrollingDebounced();
    };

    window.addEventListener("wheel", handleWheel);
    return () => {
      stopScrollingDebounced.abort();
      window.removeEventListener("wheel", handleWheel);
    };
  }, [maxScroll, virtualScrollValue, snapPoints]);

  // handle touch input
  useEffect(() => {
    if (!pageHeight || !windowHeight) return;

    let initialTouchPos = 0;
    let initialScrollOffset = 0;
    const EXIT_VELOCITY_DAMPING = 0.14;

    const handleTouchStart = (e: TouchEvent) => {
      initialTouchPos = e.touches[0].clientY;
      initialScrollOffset = virtualScrollValue.getCurrent();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const flickVelocity = virtualScrollValue.getVelocity();
      virtualScrollValue.launch(flickVelocity, EXIT_VELOCITY_DAMPING, {
        min: -(pageHeight - windowHeight),
        max: 0,
      });

      // snap to nearest
      snaptToNearest(virtualScrollValue, snapPoints)
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currTouchPos = e.touches[0].clientY;
      const touchOffset = initialTouchPos - currTouchPos;
      const newPos = initialScrollOffset - touchOffset;
      const clampedNewPos = clamp(newPos, -maxScroll, 0);

      virtualScrollValue.lerpTo(clampedNewPos, 1);
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [maxScroll, virtualScrollValue, pageHeight, windowHeight]);


  // ============================================
  // Scroll snap implementation
  // ============================================
  const addSnapPoint = useCallback((snapPoint: SnapPoint) => {
    setSnapPoints((snapPoints) => {
      return [...snapPoints, snapPoint];
    })
  }, []);
  const removeSnapPoint = useCallback((snapPoint: SnapPoint) => {
    setSnapPoints((snapPoints) => {
      return snapPoints.filter((point) => point.id != snapPoint.id);
    })
  }, []);


  return (
    <VirtualScrollContext.Provider
      value={{
        scroll: virtualScrollValue,
        addSnapPoint,
        removeSnapPoint,
      }}
    >
      {children}
    </VirtualScrollContext.Provider>
  );
};

interface SnapInstruction {
  alignment: "top" | "bottom",
  position: number
}

function snaptToNearest(virtualScrollValue: AnimatedValue, snapPoints: SnapPoint[]) {
  const vel = virtualScrollValue.getVelocity();
  const target = virtualScrollValue.getTarget();
  const snapInstruciton = getSnapInstruction(snapPoints, -target, vel);
  console.log(snapInstruciton);
  if (!snapInstruciton) return;

  const nearest = snapInstruciton.position;
  if (snapInstruciton.alignment === "top") {
    virtualScrollValue.lerpTo(-nearest, .1);
    return;
  }
  virtualScrollValue.lerpTo(-nearest + window.innerHeight, .1);
}

function getSnapInstruction(
  points: SnapPoint[],
  projectedEndPoint: number,
  velocity: number,
  snapMargin: number = window.innerHeight,
  snapThreshold: number = .6,
): SnapInstruction | undefined {
  let snapInstruction: SnapInstruction | undefined;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const distToPoint = projectedEndPoint - point.position;
    const hasPastPoint = distToPoint > 0;

    if (Math.abs(distToPoint) > snapMargin || hasPastPoint) continue;

    const isHeadingTowardPoint = distToPoint * velocity > 0;
    const snapOverlap = Math.abs(distToPoint / snapMargin);
    const isOverEnterThreshold = snapOverlap < snapThreshold;

    console.log(snapOverlap);
    if ((isOverEnterThreshold || isHeadingTowardPoint)) {
      snapInstruction = {
        position: point.position,
        alignment: "top"
      };
      continue;
    }


    snapInstruction = {
      position: point.position,
      alignment: "bottom"
    }
  }

  return snapInstruction;
}
