// @ts-check
import tseslint from 'typescript-eslint';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
    files: ['**/*.vue'],
    languageOptions: {
        parserOptions: {
            parser: tseslint.parser,
        },
    },
}).append({
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
        parser: tseslint.parser,
    },
});
