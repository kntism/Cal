interface EvaluateResult {
  result: number | null;
  error: string | null;
}

export function evaluateExpression(expression: string): number | null {
  try {
    const cleanExpr = expression.replace(/\s/g, "");

    if (!/^[0-9+\-*/.()^sqrt]+$/.test(cleanExpr)) {
      return null;
    }

    const tokens: (string | number)[] = [];
    let currentNumber = "";

    for (let i = 0; i < cleanExpr.length; i++) {
      const char = cleanExpr[i];

      // Parse numbers (including decimals)
      if (/[0-9.]/.test(char)) {
        currentNumber += char;
      } else if (char === "*" && cleanExpr[i + 1] === "*") {
        // Parse ** as power operator
        if (currentNumber) {
          tokens.push(parseFloat(currentNumber));
          currentNumber = "";
        }
        tokens.push("**");
        i++; // Skip the next *
      } else if (/[a-z]/.test(char)) {
        // Parse function names
        if (currentNumber) {
          tokens.push(parseFloat(currentNumber));
          currentNumber = "";
        }
        let funcName = "";
        while (i < cleanExpr.length && /[a-z]/.test(cleanExpr[i])) {
          funcName += cleanExpr[i];
          i++;
        }
        tokens.push(funcName);
        i--; // Back up one since for loop will increment
      } else {
        // Parse operators and parentheses
        if (currentNumber) {
          tokens.push(parseFloat(currentNumber));
          currentNumber = "";
        }
        tokens.push(char);
      }
    }
    if (currentNumber) {
      tokens.push(parseFloat(currentNumber));
    }

    const values: number[] = [];
    const operators: string[] = [];

    const precedence = (op: string): number => {
      if (op === "+" || op === "-") return 1;
      if (op === "*" || op === "/") return 2;
      if (op === "^" || op === "**") return 3;
      return 0;
    };

    const applyOperator = () => {
      const operator = operators.pop();
      if (!operator) return;

      // Handle function calls
      if (typeof operator === "string" && operator.startsWith("func:")) {
        const funcName = operator.substring(5);
        const arg = values.pop();
        if (arg === undefined) return;

        switch (funcName) {
          case "sqrt":
            if (arg < 0) {
              throw new Error("Invalid input for sqrt");
            }
            values.push(Math.sqrt(arg));
            break;
          default:
            throw new Error(`Unknown function: ${funcName}`);
        }
        return;
      }

      // Handle binary operators
      const right = values.pop();
      const left = values.pop();
      if (right === undefined || left === undefined) return;

      switch (operator) {
        case "+":
          values.push(left + right);
          break;
        case "-":
          values.push(left - right);
          break;
        case "*":
          values.push(left * right);
          break;
        case "/":
          if (right === 0) {
            throw new Error("Division by zero");
          }
          values.push(left / right);
          break;
        case "^":
        case "**":
          values.push(Math.pow(left, right));
          break;
      }
    };

    for (const token of tokens) {
      if (typeof token === "number") {
        values.push(token);
      } else if (token === "(") {
        operators.push(token);
      } else if (token === ")") {
        // Process all operators until the matching "("
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== "("
        ) {
          applyOperator();
        }
        if (operators.length === 0 || operators[operators.length - 1] !== "(") {
          throw new Error("Mismatched parentheses");
        }
        operators.pop(); // Pop the "("
        // Check if there's a function before the "(" and apply it
        if (
          operators.length > 0 &&
          typeof operators[operators.length - 1] === "string" &&
          operators[operators.length - 1].startsWith("func:")
        ) {
          const funcName = operators.pop() as string;
          // Create a temporary operator to call applyOperator
          operators.push(funcName);
          applyOperator();
        }
      } else if (typeof token === "string" && /^[a-z]+$/.test(token)) {
        // Function name - push with "func:" prefix
        operators.push(`func:${token}`);
      } else {
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== "(" &&
          precedence(operators[operators.length - 1] as string) >=
            precedence(token as string)
        ) {
          applyOperator();
        }
        operators.push(token as string);
      }
    }

    while (operators.length > 0) {
      applyOperator();
    }

    return values.length > 0 ? values[0] : null;
  } catch (error) {
    return null;
  }
}
