import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      "indent": ["error", 2], // Use core ESLint "indent" rule for TypeScript files
      "semi": ["error", "always"], // Use core ESLint "semi" rule for enforcing semicolons
      "@typescript-eslint/no-unused-vars": "off", // Disable the TypeScript-specific rule
    },
  },
];
