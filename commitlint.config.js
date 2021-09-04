module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'chore',
        'docs',
        'feat',
        'fix',
        'imp',
        'refactor',
        'revert',
        'style',
        'test',
        'update',
        'wip',
      ],
    ],
  },
};
