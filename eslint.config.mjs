// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    // ignore shadcn/ui components
    ignores: ['components/ui/**/*.vue'],
  },
);
