export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // Existing DOM IDs also reserve stable widths for translated controls.
    // Migration to class selectors remains tracked in the verification report.
    'selector-max-id': null,
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$',
      { message: 'Use kebab-case BEM class names.' },
    ],
  },
};
