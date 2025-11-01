"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

interface InputRow {
  id: string;
  value: string;
  result?: number | null;
  error?: string | null;
}

function evaluateExpression(expression: string): number | null {
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
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== "("
        ) {
          applyOperator();
        }
        if (operators.length === 0 || operators[operators.length - 1] !== "(") {
          throw new Error("Mismatched parentheses");
        }
        operators.pop();
        // Check if there's a function before the "("
        if (
          operators.length > 0 &&
          typeof operators[operators.length - 1] === "string" &&
          operators[operators.length - 1].startsWith("func:")
        ) {
          const funcName = operators.pop() as string;
          applyOperator();
          operators.push(funcName); // Re-push for argument processing
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

export default function BasicMathCalculator() {
  const [rows, setRows] = useState<InputRow[]>([
    { id: "1", value: "", result: null, error: null },
  ]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [showSymbolKeyboard, setShowSymbolKeyboard] = useState(false);

  const handleGlobalKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Shift") {
      const newRows = [...rows];
      const insertIndex = selectedRowIndex + 1;
      const newId = Date.now().toString();
      newRows.splice(insertIndex, 0, {
        id: newId,
        value: "",
        result: null,
        error: null,
      });
      setRows(newRows);
      setSelectedRowIndex(insertIndex);
    } else if (e.key === "Delete") {
      if (selectedRowIndex > 0 && rows.length > 1) {
        const newRows = rows.filter((_, index) => index !== selectedRowIndex);
        setRows(newRows);
        setSelectedRowIndex(selectedRowIndex - 1);
      }
    } else if (e.key === "Control") {
      e.preventDefault();
      setShowSymbolKeyboard(!showSymbolKeyboard);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKeyPress);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyPress);
    };
  }, [selectedRowIndex, rows, showSymbolKeyboard]);

  const handleRowChange = (index: number, value: string) => {
    const newRows = [...rows];
    newRows[index].value = value;
    newRows[index].result = null;
    newRows[index].error = null;
    setRows(newRows);
  };

  const insertSymbol = (symbol: string) => {
    const newRows = [...rows];
    const currentRow = newRows[selectedRowIndex];
    const inputElement = document.querySelector(
      `input[data-row-index="${selectedRowIndex}"]`
    ) as HTMLInputElement;

    if (inputElement) {
      const start = inputElement.selectionStart || 0;
      const end = inputElement.selectionEnd || 0;
      const newValue =
        currentRow.value.slice(0, start) + symbol + currentRow.value.slice(end);
      newRows[selectedRowIndex].value = newValue;
      newRows[selectedRowIndex].result = null;
      newRows[selectedRowIndex].error = null;
      setRows(newRows);

      // Restore focus and set cursor position after symbol
      setTimeout(() => {
        inputElement.focus();
        inputElement.setSelectionRange(
          start + symbol.length,
          start + symbol.length
        );
      }, 0);
    } else {
      // Fallback: append to end
      newRows[selectedRowIndex].value += symbol;
      newRows[selectedRowIndex].result = null;
      newRows[selectedRowIndex].error = null;
      setRows(newRows);
    }
  };

  const handleRowKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Enter") {
      const calculatedResult = evaluateExpression(rows[index].value);
      const newRows = [...rows];
      if (calculatedResult === null) {
        newRows[index].result = null;
        newRows[index].error = "输入的算式无效，请检查后重试";
      } else {
        newRows[index].result = calculatedResult;
        newRows[index].error = null;
      }
      setRows(newRows);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-11/12 mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">Basic Math Calculator</h1>
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="操作说明"
              >
                <HelpCircle className="w-6 h-6 text-gray-600 hover:text-blue-600" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>操作说明</DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-4 text-sm text-gray-700 mt-4">
                    <div className="space-y-2">
                      <div>
                        <kbd className="px-2 py-1 bg-blue-200 rounded">
                          Shift
                        </kbd>
                        <span className="ml-2">添加新行</span>
                      </div>
                      <div>
                        <kbd className="px-2 py-1 bg-blue-200 rounded">
                          Delete
                        </kbd>
                        <span className="ml-2">删除当前行</span>
                      </div>
                      <div>
                        <kbd className="px-2 py-1 bg-blue-200 rounded">
                          Enter
                        </kbd>
                        <span className="ml-2">计算当前行</span>
                      </div>
                      <div>
                        <kbd className="px-2 py-1 bg-green-200 rounded text-green-800">
                          Ctrl
                        </kbd>
                        <span className="ml-2">在当前行左侧显示符号键盘</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="font-semibold mb-2">支持的运算符：</p>
                      <ul className="space-y-1 text-xs">
                        <li>• + - * / (基本四则运算)</li>
                        <li>• ^ 或 ** (幂运算)</li>
                        <li>• sqrt() (开方)</li>
                        <li>• () (括号，控制优先级)</li>
                      </ul>
                    </div>
                    <div className="pt-2">
                      <p className="font-semibold mb-1">示例：</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 2 + 3 * 4</li>
                        <li>• 5 ^ 2</li>
                        <li>• sqrt(16)</li>
                        <li>• (2 + 3) * 4</li>
                      </ul>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className=" max-w-[100%] mx-auto">
          <div className="space-y-3">
            {rows.map((row, index) => (
              <div
                key={row.id}
                className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                  index === selectedRowIndex
                    ? "bg-blue-50 border-blue-400 shadow-md"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedRowIndex(index)}
              >
                <span
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                           font-semibold text-gray-600"
                >
                  {index + 1}
                </span>

                {showSymbolKeyboard && index === selectedRowIndex && (
                  <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-lg border border-gray-300 shadow-md">
                    <div className="grid grid-cols-4 gap-1">
                      <button
                        onClick={() => insertSymbol("+")}
                        className="w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors text-sm font-semibold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => insertSymbol("-")}
                        className="w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors text-sm font-semibold"
                      >
                        -
                      </button>
                      <button
                        onClick={() => insertSymbol("*")}
                        className="w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors text-sm font-semibold"
                      >
                        ×
                      </button>
                      <button
                        onClick={() => insertSymbol("/")}
                        className="w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors text-sm font-semibold"
                      >
                        ÷
                      </button>

                      <button
                        onClick={() => insertSymbol("^")}
                        className="w-10 h-10 bg-purple-100 border border-purple-300 rounded-lg hover:bg-purple-200 transition-colors text-sm font-semibold text-purple-700"
                      >
                        ^
                      </button>
                      <button
                        onClick={() => insertSymbol("**")}
                        className="w-10 h-10 bg-purple-100 border border-purple-300 rounded-lg hover:bg-purple-200 transition-colors text-xs font-semibold text-purple-700"
                      >
                        **
                      </button>
                      <button
                        onClick={() => insertSymbol("sqrt(")}
                        className="w-10 h-10 bg-purple-100 border border-purple-300 rounded-lg hover:bg-purple-200 transition-colors text-xs font-semibold text-purple-700"
                      >
                        √
                      </button>
                      <button
                        onClick={() => insertSymbol("pi")}
                        className="w-10 h-10 bg-purple-100 border border-purple-300 rounded-lg hover:bg-purple-200 transition-colors text-sm font-semibold text-purple-700"
                      >
                        π
                      </button>

                      <button
                        onClick={() => insertSymbol("(")}
                        className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                      >
                        (
                      </button>
                      <button
                        onClick={() => insertSymbol(")")}
                        className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                      >
                        )
                      </button>
                      <button
                        onClick={() => insertSymbol(".")}
                        className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                      >
                        .
                      </button>
                      <button
                        onClick={() => insertSymbol(",")}
                        className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                      >
                        ,
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => handleRowChange(index, e.target.value)}
                  onKeyPress={(e) => handleRowKeyPress(e, index)}
                  onFocus={() => setSelectedRowIndex(index)}
                  data-row-index={index}
                  placeholder="例如：2 + 3 * 4"
                  className="flex-1 px-4 py-2 text-lg border border-gray-300 rounded
                         focus:border-blue-500 focus:outline-none transition-colors"
                />

                <div className="flex-shrink-0 w-48">
                  {row.result !== null && (
                    <div className="text-sm text-green-600 font-semibold">
                      {row.value} = {row.result}
                    </div>
                  )}
                  {row.error && (
                    <div className="text-sm text-red-600">{row.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
