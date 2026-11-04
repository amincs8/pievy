export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-empty": [2, "never"],
    "scope-enum": [2, "always", ["repo", "types"]],
    "subject-empty": [2, "never"],
  },
};
