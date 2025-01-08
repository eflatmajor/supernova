const BOOLEAN_MAP = {
  "0": false,
  "no": false,
  "off": false,
  "false": false,
  "1": true,
  "yes": true,
  "on": true,
  "true": true
};

export function parseArgument(arg) {
  let [lhs, rhs] = arg.split(":");

  if ( ! rhs) {
    return lhs;
  }

  if (lhs === "boolean") {
    rhs = BOOLEAN_MAP[rhs];
  }
  else if (lhs === "number") {
    rhs = Number(rhs);
  }
  else if (lhs === "array") {
    rhs = rhs.split(",");
  }

  return rhs;
}
