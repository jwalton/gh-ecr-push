import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'warn',
        }
    },
    {
        plugins: {
            import: importPlugin,
        },
        rules: {
            'import/extensions': ['error', 'ignorePackages'],
        },
    },
];
