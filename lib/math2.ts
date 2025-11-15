export function evaluateExpression2(expression: string): number | null {
  try {
    //定义合法函数组
    const canUseFunc = ["sin", "cos", "tan", "cot"];
    const tokens =
      expression
        .replace(/\s+/g, "")
        .match(/(\d+\.?\d*|[a-zA-Z]+|\+|\-|\*|\/|\(|\))/g) || [];
    //判定返回 null：
    //若有非法函数，返回 null
    const funcInExpr = expression.replace(/\s+/g, "").match(/[a-zA-Z]+/g);
    if (funcInExpr) {
      for (let i = 0; i < funcInExpr?.length; i++) {
        if (!canUseFunc.includes(funcInExpr[i])) {
          return null;
        }
      }
    }
    //若左括号和右括号数量不一样，返回null
    const leftBracket = expression.replace(/\s+/g, "").match(/\(/g);
    const rightBracket = expression.replace(/\s+/g, "").match(/\)/g);
    if (leftBracket?.length !== rightBracket?.length) {
      return null;
    }
    //下写有关符号的返回null
    //定义isObj函数（关键）
    const isObj = (body: string) => {
      if (!isNaN(+body)) {
        return true;
      } else if (/[a-zA-Z]+/.test(body)) {
        return true;
      } else {
        return false;
      }
    };
    //定义是否是符号函数
    const isSign = (body: string) => {
      if (/\+|\-|\*|\//.test(body)) {
        return true;
      } else {
        return false;
      }
    };
    //‘+’为一元运算符（后面必跟 obj），也是二元运算符（前后必跟 obj）
    //‘-’为一元运算符（后面必跟 obj），也是二元运算符（前后必跟 obj）
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === "+" || "-") {
        if (tokens[i + 1] === undefined) {
          return null;
        } else if (!isSign(tokens[i + 1])) {
          return null;
        }
      }
    }

    const calc = (tokenExpr: Array<string>) => {
      let i = 0;
      while (i < tokenExpr.length) {
        if (tokenExpr[i] === "-") {
          if (i === 0 || isNaN(+tokenExpr[i - 1])) {
            const newElement = tokenExpr[i] + tokenExpr[i + 1];
            tokenExpr.splice(i, 2, newElement);
          }
        } else if (tokenExpr[i] === "+") {
          if (i === 0 || isNaN(+tokenExpr[i - 1])) {
            tokenExpr.splice(i, 1);
          }
        } else i++;
      }
      try {
        if (
          tokenExpr.includes("sin") ||
          tokenExpr.includes("cos") ||
          tokenExpr.includes("tan") ||
          tokenExpr.includes("cot") ||
          tokenExpr.includes("sqrt")
        ) {
          let i = 0;
          while (i < tokenExpr.length) {
            // if (tokenExpr[i + 1] === "-") {
            //   const newNumber = tokenExpr[i + 1] + tokenExpr[i + 2];
            //   tokenExpr.splice(i + 1, 2, newNumber);
            //   while (+tokenExpr[i + 1] < 0) {
            //     tokenExpr.splice(i + 1, 1, String(+tokenExpr[i + 1] + 360));
            //   }
            // }
            let number;
            if (i + 1 < tokenExpr.length) {
              number = (+tokenExpr[i + 1] / 180) * Math.PI;
            }
            if (tokenExpr[i] === "sin") {
              console.log("sin");
              if (
                i - 1 !== -1 &&
                !isNaN(+tokenExpr[i - 1]) &&
                number !== undefined
              ) {
                console.log("sin 前面有数字");
                tokenExpr.splice(
                  i - 1,
                  3,
                  (+tokenExpr[i - 1] * Math.sin(number)).toString()
                );
              } else if (number !== undefined) {
                tokenExpr.splice(i, 2, Math.sin(number).toString());
              }
            } else if (tokenExpr[i] === "cos") {
              if (
                i - 1 !== -1 &&
                !isNaN(+tokenExpr[i - 1]) &&
                number !== undefined
              ) {
                tokenExpr.splice(
                  i - 1,
                  3,
                  (+tokenExpr[i - 1] * Math.cos(number)).toString()
                );
              } else if (number !== undefined) {
                tokenExpr.splice(i, 2, Math.cos(number).toString());
              }
            } else if (tokenExpr[i] === "tan") {
              if (
                i - 1 !== -1 &&
                !isNaN(+tokenExpr[i - 1]) &&
                number !== undefined
              ) {
                tokenExpr.splice(
                  i - 1,
                  3,
                  (+tokenExpr[i - 1] * Math.tan(number)).toString()
                );
              } else if (tokenExpr[i + 1] === "90") {
                tokenExpr.splice(i, 2, "Infinity");
              } else if (number !== undefined) {
                tokenExpr.splice(i, 2, Math.tan(number).toString());
              }
            } else if (tokenExpr[i] === "cot") {
              if (
                i - 1 !== -1 &&
                !isNaN(+tokenExpr[i - 1]) &&
                number !== undefined
              ) {
                tokenExpr.splice(
                  i - 1,
                  3,
                  (+tokenExpr[i - 1] * (1 / Math.tan(number))).toString()
                );
              } else if (tokenExpr[i + 1] === "0") {
                tokenExpr.splice(i, 2, "Infinity");
              } else if (number !== undefined) {
                tokenExpr.splice(i, 2, (1 / Math.tan(number)).toString());
              }
            } else i++;
          }
        }
        // 处理加减乘除
        let p = 0;
        while (p < tokenExpr.length) {
          if (tokenExpr[p] === "*" || tokenExpr[p] === "/") {
            const a = +tokenExpr[p - 1],
              b = +tokenExpr[p + 1];
            if (tokenExpr[p] === "/" && b === 0) throw "Division by zero";
            tokenExpr.splice(
              p - 1,
              3,
              (tokenExpr[p] === "*" ? a * b : a / b).toString()
            );
          } else p++;
        }
        p = 0;
        while (p < tokenExpr.length) {
          if (tokenExpr[p] === "+" || tokenExpr[p] === "-") {
            const a = +tokenExpr[p - 1],
              b = +tokenExpr[p + 1];
            tokenExpr.splice(
              p - 1,
              3,
              (tokenExpr[p] === "+" ? a + b : a - b).toString()
            );
          } else p++;
        }
        if (tokenExpr.length !== 1) {
          console.log("计算过程有问题");
          console.log(tokenExpr.length);
          console.log(tokenExpr);
          return undefined; // 明确返回 undefined
        } else {
          return String(tokenExpr[0]);
        }
      } catch (e) {
        console.log(e);
        return undefined; // 出现异常时也返回 undefined
      }
    };
    // 处理括号
    let m = tokens.length - 1;
    while (m >= 0) {
      if (tokens[m] === "(") {
        let n = m;
        while (n < tokens.length) {
          if (tokens[n] === ")") {
            const result = calc(tokens.slice(m + 1, n));
            if (result !== undefined) {
              console.log("可以计算");
              tokens.splice(m, n - m + 1, result);
            }
          } else n++;
        }
      } else m--;
    }

    const finalResult = calc(tokens);
    if (finalResult === undefined) {
      return null;
    }
    return Number(Number(finalResult).toFixed(5));
  } catch {
    return null;
  }
}
