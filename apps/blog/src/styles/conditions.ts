import type { Config } from "@pandacss/dev";

type Conditions = NonNullable<Config["conditions"]>["extend"];

export const conditions: Conditions = {
  notEmpty: "&:not(:is(:empty, [data-empty]))",
};
