'use client';

import { useState, useEffect } from 'react';

interface InputRow {
  id: string;
  value: string;
  result?: number | null;
  error?: string | null;
}

function evaluateExpression(expression: string): number | null {
  try {
    const cleanExpr = expression.replace(/\s/g, '');

    if (!/^[0-9+\-*/.()]+$/.test(cleanExpr)) {
      return null;
    }

    const tokens: (string | number)[] = [];
    let currentNumber = '';

    for (let i = 0; i < cleanExpr.length; i++) {
      const char = cleanExpr[i];
      if (/[0-9.]/.test(char)) {
        currentNumber += char;
      } else {
        if (currentNumber) {
          tokens.push(parseFloat(currentNumber));
          currentNumber = '';
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
      if (op === '+' || op === '-') return 1;
      if (op === '*' || op === '/') return 2;
      return 0;
    };

    const applyOperator = () => {
      const operator = operators.pop();
      if (!operator) return;

      const right = values.pop();
      const left = values.pop();
      if (right === undefined || left === undefined) return;

      switch (operator) {
        case '+':
          values.push(left + right);
          break;
        case '-':
          values.push(left - right);
          break;
        case '*':
          values.push(left * right);
          break;
        case '/':
          if (right === 0) {
            throw new Error('Division by zero');
          }
          values.push(left / right);
          break;
      }
    };

    for (const token of tokens) {
      if (typeof token === 'number') {
        values.push(token);
      } else if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== '('
        ) {
          applyOperator();
        }
        if (operators.length === 0 || operators[operators.length - 1] !== '(') {
          throw new Error('Mismatched parentheses');
        }
        operators.pop();
      } else {
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== '(' &&
          precedence(operators[operators.length - 1]) >=
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
    { id: '1', value: '', result: null, error: null }
  ]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);

  const handleGlobalKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'a' || e.key === 'A') {
      const newRows = [...rows];
      const insertIndex = selectedRowIndex + 1;
      const newId = Date.now().toString();
      newRows.splice(insertIndex, 0, {
        id: newId,
        value: '',
        result: null,
        error: null
      });
      setRows(newRows);
      setSelectedRowIndex(insertIndex);
    } else if (e.key === 'Delete') {
      if (selectedRowIndex > 0 && rows.length > 1) {
        const newRows = rows.filter((_, index) => index !== selectedRowIndex);
        setRows(newRows);
        setSelectedRowIndex(selectedRowIndex - 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyPress);
    };
  }, [selectedRowIndex, rows]);

  const handleRowChange = (index: number, value: string) => {
    const newRows = [...rows];
    newRows[index].value = value;
    newRows[index].result = null;
    newRows[index].error = null;
    setRows(newRows);
  };

  const handleRowKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Enter') {
      const calculatedResult = evaluateExpression(rows[index].value);
      const newRows = [...rows];
      if (calculatedResult === null) {
        newRows[index].result = null;
        newRows[index].error = '输入的算式无效，请检查后重试';
      } else {
        newRows[index].result = calculatedResult;
        newRows[index].error = null;
      }
      setRows(newRows);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Basic Math Calculator</h1>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>操作说明：</strong>
            按 <kbd className="px-2 py-1 bg-blue-200 rounded">a</kbd> 添加行，
            按 <kbd className="px-2 py-1 bg-blue-200 rounded">Delete</kbd> 删除当前行，
            按 <kbd className="px-2 py-1 bg-blue-200 rounded">Enter</kbd> 计算当前行
          </p>
        </div>

        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                index === selectedRowIndex
                  ? 'bg-blue-50 border-blue-400 shadow-md'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedRowIndex(index)}
            >
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                           font-semibold text-gray-600">
                {index + 1}
              </span>

              <input
                type="text"
                value={row.value}
                onChange={(e) => handleRowChange(index, e.target.value)}
                onKeyPress={(e) => handleRowKeyPress(e, index)}
                onFocus={() => setSelectedRowIndex(index)}
                placeholder="输入算式，例如：2 + 3 * 4"
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
                  <div className="text-sm text-red-600">
                    {row.error}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
