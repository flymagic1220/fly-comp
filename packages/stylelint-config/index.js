export default {
    extends: [
      'stylelint-config-standard',
      'stylelint-config-recommended-vue',
      'stylelint-config-recess-order',
    ],
    rules: {
      'selector-class-pattern': null,
      'no-descending-specificity': null,
    },
  };
  