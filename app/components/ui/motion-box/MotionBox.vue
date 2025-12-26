<template>
  <Motion
    :initial="computedInitial as any"
    :animate="computedAnimate as any"
    :transition="computedTransition as any"
    v-bind="$attrs"
  >
    <slot />
  </Motion>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Motion } from 'motion-v';
import { presets, type PresetName } from './presets';

interface Props {
  /**
   * Animation preset to use
   * @default 'fadeUp'
   */
  preset?: PresetName;

  /**
   * Delay before animation starts (in seconds)
   */
  delay?: number;

  /**
   * Animation duration (in seconds)
   */
  duration?: number;

  /**
   * Blur amount for initial state (in pixels)
   */
  blur?: number;

  /**
   * Y-axis slide distance (positive = from bottom, negative = from top)
   */
  slideY?: number;

  /**
   * X-axis slide distance
   */
  slideX?: number;

  /**
   * Initial scale value
   */
  scale?: number;

  /**
   * Initial rotation (in degrees)
   */
  rotate?: number;

  /**
   * Use spring physics for transition
   * @default true for most presets
   */
  spring?: boolean;

  /**
   * Spring stiffness (only applies when spring=true)
   */
  stiffness?: number;

  /**
   * Spring damping (only applies when spring=true)
   */
  damping?: number;

  /**
   * Easing function (only applies when spring=false)
   */
  ease?: string;
}

const props = withDefaults(defineProps<Props>(), {
  preset: 'fadeUp',
  delay: undefined,
  duration: undefined,
  blur: undefined,
  slideY: undefined,
  slideX: undefined,
  scale: undefined,
  rotate: undefined,
  spring: undefined,
  stiffness: undefined,
  damping: undefined,
  ease: undefined,
});

defineOptions({
  inheritAttrs: false,
});

const basePreset = computed(() => presets[props.preset]);

const computedInitial = computed(() => {
  const base: Record<string, unknown> = { ...basePreset.value.initial };

  // Override with individual props if provided
  if (props.blur !== undefined) {
    base.filter = `blur(${props.blur}px)`;
  }
  if (props.slideY !== undefined) {
    base.y = props.slideY;
  }
  if (props.slideX !== undefined) {
    base.x = props.slideX;
  }
  if (props.scale !== undefined) {
    base.scale = props.scale;
  }
  if (props.rotate !== undefined) {
    base.rotate = props.rotate;
  }

  return base;
});

const computedAnimate = computed(() => {
  const base: Record<string, unknown> = { ...basePreset.value.animate };

  // Ensure animate state matches the initial overrides (target values)
  if (props.blur !== undefined) {
    base.filter = 'blur(0px)';
  }
  if (props.slideY !== undefined) {
    base.y = 0;
  }
  if (props.slideX !== undefined) {
    base.x = 0;
  }
  if (props.scale !== undefined) {
    base.scale = 1;
  }
  if (props.rotate !== undefined) {
    base.rotate = 0;
  }

  return base;
});

const computedTransition = computed(() => {
  const base: Record<string, unknown> = { ...basePreset.value.transition };

  // Override timing
  if (props.delay !== undefined) {
    base.delay = props.delay;
  }
  if (props.duration !== undefined) {
    base.duration = props.duration;
  }

  // Override spring settings
  if (props.spring !== undefined) {
    base.type = props.spring ? 'spring' : 'tween';
    if (!props.spring) {
      delete base.stiffness;
      delete base.damping;
      base.ease = props.ease ?? 'easeOut';
    }
  }
  if (props.stiffness !== undefined) {
    base.stiffness = props.stiffness;
  }
  if (props.damping !== undefined) {
    base.damping = props.damping;
  }
  if (props.ease !== undefined) {
    base.ease = props.ease;
  }

  return base;
});
</script>
