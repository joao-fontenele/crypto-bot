module.exports = {
  "extends": "airbnb-base",
  "parser": "babel-eslint",
  "rules": {
    "max-len": ["warn", 80, {"ignoreUrls": true}],
    "object-curly-spacing": "off",
    "global-require": "warn",
    "import/no-dynamic-require": "off",
    "no-underscore-dangle": "off",
    "quote-props": ["error", "consistent-as-needed"],
    "prefer-arrow-callback": ["off"],
    "space-before-function-paren": [
      "error", {
        "anonymous": "never",
        "named": "always",
        "asyncArrow": "ignore",
      },
    ],
    "no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "args": "after-used",
      },
    ],
    "indent": [
      "error",
      4,
      {
        "MemberExpression": 1,
        "SwitchCase": 1,
      },
    ],
    "import/no-extraneous-dependencies": ["off", {"dev-dependencies": true}],
    "no-undef": ["warn"],
    "func-names": ["off"],
    "no-unused-expressions": ["warn"],
  },
  "env": {
    "es6": true,
    "node": true,
  }
};
