import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";

const ignores = [
    "node_modules/**/*",
    "vscode/**/*",
    "temp/**/*",
    ".nuxt/**/*",
    ".output/**/*",
    "server/vendor/**/*",
];

export default [
    {
        languageOptions: { 
            globals: { 
                ...globals.browser,
                ...globals.node, 
            },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/essential"],

    {
        name: "typescript-eslint/base",
        ignores,
    },

    {
        name: "typescript-eslint/recommended",
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
        ignores,
    },

    {
        plugins: {
            "@stylistic": stylistic,
        },

        rules: {
            "@stylistic/array-element-newline": ["error", "consistent"],
            "@stylistic/arrow-parens": ["error", "always"],
            "@stylistic/arrow-spacing": ["error", {before: true, after: true}],
            "@stylistic/block-spacing": ["error", "always"],
            "@stylistic/brace-style": ["error", "1tbs"], // if else conditions will begin in a new line after curly braces. See https://eslint.org/docs/2.0.0/rules/brace-style#stroustrup
            "@stylistic/comma-dangle": ["error", "always-multiline"], // Require trailing comma only when using multiline objects, arrays etc. See https://eslint.org/docs/2.0.0/rules/brace-style#stroustrup
            "@stylistic/comma-spacing": ["error", { before: false, after: true }],
            "@stylistic/dot-location": ["error", "property"],
            "@stylistic/indent": ["error", 4],
            "@stylistic/eol-last": ["error", "never"],
            "@stylistic/function-call-spacing": ["error", "never"],
            "@stylistic/function-call-argument-newline": ["error", "consistent"],
            // "@stylistic/function-paren-newline": ["error", "never"],
            "@stylistic/generator-star-spacing": ["error", {before: true, after: false }],
            "@stylistic/key-spacing": ["error", { afterColon: true }],
            "@stylistic/member-delimiter-style": ["error", {
                multiline: {
                    delimiter: "semi",
                    requireLast: true,
                },
                singleline: {
                    delimiter: "semi",
                    requireLast: false,
                },
                multilineDetection: "brackets",
            }],
            "@stylistic/one-var-declaration-per-line": ["error", "always"],
            "@stylistic/quote-props": ["error", "as-needed"],
            "@stylistic/quotes": ["error", "double", { allowTemplateLiterals: true }], // Strings should be double quotes per guidelines.
            "@stylistic/semi": ["error", "always"],
            "@stylistic/space-before-function-paren": ["error", "never"], // Disallow space before function. See https://eslint.org/docs/rules/space-before-function-paren#never
            "@stylistic/switch-colon-spacing": ["error", {after: true, before: false}],
            "@stylistic/type-annotation-spacing": ["error"],
            "@stylistic/type-generic-spacing": ["error"],
            "@stylistic/type-named-tuple-spacing": ["error"],
            "@stylistic/yield-star-spacing": ["error", "before"],
        },
    
        ignores,

    },
];