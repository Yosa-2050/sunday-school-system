module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-max-line-length': [2, 'always', 100],
        'footer-max-line-length': [2, 'always', 100],
    },
    ignores: [
        (commit) =>
            commit.includes('[skip ci]') ||
            commit.includes('chore(release):') ||
            commit.startsWith('Merge'),
    ],
};
