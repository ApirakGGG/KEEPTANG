export const rules = {
  "@typescript-eslint/no-unused-vars":
    process.env.NODE_ENV === "production" ? "error" : "warn",
  " eslint-disable @typescript-eslint/no-explicit-any":
    process.env.NODE_ENV === "production" ? "error" : "warn",
};
