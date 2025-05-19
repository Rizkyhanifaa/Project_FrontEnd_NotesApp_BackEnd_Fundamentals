import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import daStyle from 'eslint-config-dicodingacademy';

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    rules: {
      "linebreak-style": ["error", "windows"], // ganti jadi "off" kalau ingin matikan
    },
  },
];


