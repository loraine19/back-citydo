const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierPlugin = require('eslint-plugin-prettier/recommended');

module.exports = tseslint.config(
    {
        ignores: ['eslint.config.js', 'dist/**', 'node_modules/**'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierPlugin,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname,
                sourceType: 'module',
            },
        },
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    }
);