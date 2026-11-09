export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-max-id': 0,
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$',
      { message: 'Use kebab-case BEM class names.' },
    ],
  },
};
