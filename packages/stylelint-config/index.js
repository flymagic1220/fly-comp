export default {
    extends: [
      'stylelint-config-standard-scss',
      'stylelint-config-recommended-vue/scss',
      'stylelint-config-recess-order',
    ],
    rules: {
      'selector-class-pattern': null,
      'no-descending-specificity': null,
      'scss/at-rule-no-unknown': true,
    },
  };
  