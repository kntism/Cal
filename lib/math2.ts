export function evaluateExpression2(expression: string): number | null {
  try {
    const tokens =
      expression
        .replace(/\s+/g, "")
        .match(/(\d+\.?\d*|[a-zA-Z]+|\+|\-|\*|\/|\(|\))/g) || [];
    const calc = (tokenExpr: Array<string>) => {
      try {
        let i = 0;
        while (i < tokenExpr.length) {
          if (tokenExpr[i] === "*" || tokenExpr[i] === "/") {
            const a = +tokenExpr[i - 1],
              b = +tokenExpr[i + 1];
            if (tokenExpr[i] === "/" && b === 0) throw "Division by zero";
            tokenExpr.splice(
              i - 1,
              3,
              (tokenExpr[i] === "*" ? a * b : a / b).toString()
            );
          } else i++;
        }
        i = 0;
        while (i < tokenExpr.length) {
          if (tokenExpr[i] === "+" || tokenExpr[i] === "-") {
            const a = +tokenExpr[i - 1],
              b = +tokenExpr[i + 1];
            tokenExpr.splice(
              i - 1,
              3,
              (tokenExpr[i] === "+" ? a + b : a - b).toString()
            );
          } else i++;
        }
        if (tokenExpr.length !== 1) {
          console.log("计算过程有问题");
        } else {
          return String(tokenExpr[0]);
        }
      } catch (e) {
        console.log(e);
      }
    };

    let m = tokens.length - 1;
    while (m >= 0) {
      if (tokens[m] === "(") {
        let n = m;
        while (n < tokens.length) {
          if (tokens[n] === ")") {
            if (calc(tokens.slice(m + 1, n)) !== undefined) {
              tokens.splice(m, n - m + 1, calc(tokens.slice(m + 1, n)));
            }
          } else n++;
        }
      } else m--;
    }
    if (
      tokens.includes("sin") ||
      tokens.includes("cos") ||
      tokens.includes("tan")
    ) {
      let i = 0;
      while (i < tokens.length) {
        if (tokens[i] === "sin") {
          console.log("sin");
          if (
            typeof Number(tokens[i - 1]) === "number" &&
            !isNaN(Number(tokens[i - 1]))
          ) {
            console.log("sin 前面有数字");
            tokens.splice(
              i - 1,
              3,
              (+tokens[i - 1] * Math.sin(+tokens[i + 1])).toString()
            );
          } else {
            tokens.splice(i, 2, Math.sin(+tokens[i + 1]).toString());
          }
        } else if (tokens[i] === "cos") {
          if (
            typeof Number(tokens[i - 1]) === "number" &&
            !isNaN(Number(tokens[i - 1]))
          ) {
            tokens.splice(
              i - 1,
              3,
              (+tokens[i - 1] * Math.cos(+tokens[i + 1])).toString()
            );
          } else {
            tokens.splice(i, 2, Math.cos(+tokens[i + 1]).toString());
          }
        } else i++;
      }
    }
    /*
    if (tokens.includes("cos")) {
      let i = 0;
      while (i < tokens.length) {
        if (tokens[i] === "cos") {
          tokens.splice(i, 2, Math.cos(+tokens[i + 1]).toString());
        } else i++;
      }
    }
    if (tokens.includes("tan")) {
      let i = 0;
      while (i < tokens.length) {
        if (tokens[i] === "tan") {
          tokens.splice(i, 2, Math.tan(+tokens[i + 1]).toString());
        } else i++;
      }
    }
    if (tokens.includes("cot")) {
      let i = 0;
      while (i < tokens.length) {
        if (tokens[i] === "cot") {
          tokens.splice(i, 2, 1 / Math.tan(+tokens[i + 1]).toString());
        } else i++;
      }
    }
    if (tokens.includes("sqrt")) {
      let i = 0;
      while (i < tokens.length) {
        if (tokens[i] === "sqrt") {
          tokens.splice(i, 2, Math.sqrt(+tokens[i + 1]).toString());
        } else i++;
      }
    }
    */
    return Number(calc(tokens));
  } catch {
    return null;
  }
}
