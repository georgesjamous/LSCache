module.exports = {
  "env": {
      "browser": true,
      "es6": true
  },
  "extends": "eslint:recommended",
  "parser": "typescript-eslint-parser",
  "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "globals": {
      "Parse": true
  },
  "rules": {
      "indent": [
          "error",
          "tab"
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "double"
      ],
      "semi": [2, "always"],
      "no-mixed-spaces-and-tabs": 0,
      "no-undef": 0,
      "no-console": "off"
  }
};