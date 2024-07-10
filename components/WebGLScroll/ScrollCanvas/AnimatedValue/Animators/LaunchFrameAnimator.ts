import { clamp } from "@/utils/clamp";
import { AnimationState } from "../AnimatedValue";
import { FrameAnimator } from "./FrameAnimator";
import CleanupProtocol from "cleanup-protocol";

const STOP_THRESHOLD = 0.01;

export class LaunchFrameAnimator implements FrameAnimator, CleanupProtocol {
  private velocity = 0;
  private damp = 0;
  private bound = { min: Infinity, max: Infinity };

  launchWith(
    velocity: number,
    damp: number,
    bound = { min: Infinity, max: Infinity }
  ) {
    this.velocity = velocity;
    this.damp = damp;
    this.bound = bound;
    return this;
  }

  animate(state: AnimationState, delta: number): boolean {

    // Update velocity based on dampening
    this.velocity *= 1 - this.damp * delta;

    // Update position based on velocity
    const vel = this.velocity * delta;
    const current = state.current + vel;
    const clampedCurrent = clamp(current, this.bound.min, this.bound.max);

    // Update state before assigning new values
    state.prevVelocity = state.velocity;

    state.current = clampedCurrent;
    state.velocity = this.velocity;
    state.acceleration = state.velocity - state.prevVelocity;

    const hasHitBound = current !== clampedCurrent;

    // Check if velocity is below stop threshold
    if (Math.abs(this.velocity) < STOP_THRESHOLD || hasHitBound) {
      return false; // Animation finished
    }

    return true; // Continue animation
  }

  cleanup(): void { }
}
