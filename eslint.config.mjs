import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    pluginJs.configs.recommended,
    {
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
        },
    },
    eslintConfigPrettier, // prettier 충돌하는 eslint 규칙을 꺼줌
];
