export interface AnimationState {
  opacity?: number;
  y?: number;
  x?: number;
  scale?: number;
  rotate?: number;
  filter?: string;
}

export interface TransitionConfig {
  duration: number;
  type?: 'spring' | 'tween';
  ease?: string;
  stiffness?: number;
  damping?: number;
}

export interface AnimationPreset {
  initial: AnimationState;
  animate: AnimationState;
  transition: TransitionConfig;
}

/**
 * Simple fade in animation
 */
export const fade: AnimationPreset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

/**
 * Fade + slide from bottom (most common pattern)
 */
export const fadeUp: AnimationPreset = {
  initial: { opacity: 0, y: 20, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.6, type: 'spring', stiffness: 100, damping: 18 },
};

/**
 * Fade + slide from top
 */
export const fadeDown: AnimationPreset = {
  initial: { opacity: 0, y: -30, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.7, type: 'spring', stiffness: 100, damping: 15 },
};

/**
 * Fade + scale up (good for numbers, icons)
 */
export const fadeScale: AnimationPreset = {
  initial: { opacity: 0, scale: 0.5, filter: 'blur(20px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  transition: { duration: 0.6, type: 'spring', stiffness: 100, damping: 15 },
};

/**
 * Full card effect (fade + slide + scale + blur)
 */
export const card: AnimationPreset = {
  initial: { opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  transition: { duration: 0.5, type: 'spring', stiffness: 120, damping: 15 },
};

/**
 * Title entrance (fade + slide down + scale + blur)
 */
export const title: AnimationPreset = {
  initial: { opacity: 0, y: -30, scale: 0.8, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  transition: { duration: 0.7, type: 'spring', stiffness: 100, damping: 15 },
};

/**
 * Badge pop-in (fade + slide + scale + blur)
 */
export const badge: AnimationPreset = {
  initial: { opacity: 0, y: -30, scale: 0.8, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  transition: { duration: 0.7, type: 'spring', stiffness: 100, damping: 15 },
};

/**
 * Icon spin-in effect
 */
export const spinIn: AnimationPreset = {
  initial: { opacity: 0, rotate: -180, scale: 0 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  transition: { duration: 0.6, type: 'spring', stiffness: 200, damping: 12 },
};

/**
 * Hero title entrance (larger motion)
 */
export const hero: AnimationPreset = {
  initial: { opacity: 0, y: 50, scale: 0.9, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  transition: { duration: 0.8, type: 'spring', stiffness: 80, damping: 20 },
};

/**
 * Simple slide up without blur (for landing pages)
 */
export const slideUp: AnimationPreset = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

/**
 * Subtle slide for sequential items
 */
export const subtle: AnimationPreset = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' },
};

export const presets = {
  fade,
  fadeUp,
  fadeDown,
  fadeScale,
  card,
  title,
  badge,
  spinIn,
  hero,
  slideUp,
  subtle,
} as const;

export type PresetName = keyof typeof presets;


