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
import { HelpCircle, Calculator } from "lucide-react";
import { evaluateExpression } from "@/lib/math";

interface InputRow {
  id: string;
  value: string;
  result?: number | null;
  error?: string | null;
}

export default function BasicMathCalculator() {
  const [rows, setRows] = useState<InputRow[]>([
    { id: "1", value: "", result: null, error: null },
  ]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [showSymbolKeyboard, setShowSymbolKeyboard] = useState(false);

  const handleGlobalKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Delete") {
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
      e.preventDefault();
      const newRows = [...rows];
      const insertIndex = index + 1;
      const newId = Date.now().toString();
      newRows.splice(insertIndex, 0, {
        id: newId,
        value: "",
        result: null,
        error: null,
      });
      setRows(newRows);
      setSelectedRowIndex(insertIndex);
    }
  };

  const handleCalculate = (index: number) => {
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
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-black font-mono">
      <div className="max-w-11/12 mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-blue-400">Basic Math Calculator</h1>
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="p-2 rounded-full hover:bg-blue-900/30 transition-colors"
                title="操作说明"
              >
                <HelpCircle className="w-6 h-6 text-blue-400 hover:text-blue-300" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-950 border-blue-800">
              <DialogHeader>
                <DialogTitle className="text-blue-400 font-mono">操作说明</DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-4 text-sm text-blue-300 mt-4 font-mono">
                    <div className="space-y-2">
                      <div>
                        <kbd className="px-2 py-1 bg-blue-900/50 border border-blue-700 rounded text-blue-300">
                          Enter
                        </kbd>
                        <span className="ml-2">添加新行</span>
                      </div>
                      <div>
                        <kbd className="px-2 py-1 bg-blue-900/50 border border-blue-700 rounded text-blue-300">
                          Delete
                        </kbd>
                        <span className="ml-2">删除当前行</span>
                      </div>
                      <div>
                        <span className="ml-8">点击输入框右侧的</span>
                        <Calculator className="inline w-4 h-4 mx-1 text-blue-400" />
                        <span>图标计算当前行</span>
                      </div>
                      <div>
                        <kbd className="px-2 py-1 bg-blue-900/50 border border-blue-700 rounded text-blue-300">
                          Ctrl
                        </kbd>
                        <span className="ml-2">在当前行左侧显示符号键盘</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-blue-800">
                      <p className="font-semibold mb-2 text-blue-400">支持的运算符：</p>
                      <ul className="space-y-1 text-xs">
                        <li>• + - * / (基本四则运算)</li>
                        <li>• ^ 或 ** (幂运算)</li>
                        <li>• sqrt() (开方)</li>
                        <li>• () (括号，控制优先级)</li>
                      </ul>
                    </div>
                    <div className="pt-2">
                      <p className="font-semibold mb-1 text-blue-400">示例：</p>
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

        <div className="max-w-[100%] mx-auto">
          <div className="space-y-3">
            {rows.map((row, index) => (
              <div
                key={row.id}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                  index === selectedRowIndex
                    ? "bg-blue-950/50 border-blue-400 shadow-lg shadow-blue-500/20"
                    : "bg-gray-900/50 border-gray-800 hover:border-blue-800"
                }`}
                onClick={() => setSelectedRowIndex(index)}
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center font-mono text-lg ${
                    index === selectedRowIndex ? "text-blue-400" : "text-gray-500"
                  }`}
                >
                  {index + 1}
                </span>

                {showSymbolKeyboard && index === selectedRowIndex && (
                  <div className="flex flex-col gap-2 p-3 bg-gray-950 border-2 border-blue-800 rounded-lg shadow-xl shadow-blue-900/30">
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => insertSymbol("+")}
                        className="w-11 h-11 bg-gray-900 border-2 border-blue-700 rounded hover:bg-blue-900/40 hover:border-blue-500 transition-all text-sky-300 text-lg font-bold font-mono"
                      >
                        +
                      </button>
                      <button
                        onClick={() => insertSymbol("-")}
                        className="w-11 h-11 bg-gray-900 border-2 border-blue-700 rounded hover:bg-blue-900/40 hover:border-blue-500 transition-all text-sky-300 text-lg font-bold font-mono"
                      >
                        -
                      </button>
                      <button
                        onClick={() => insertSymbol("*")}
                        className="w-11 h-11 bg-gray-900 border-2 border-blue-700 rounded hover:bg-blue-900/40 hover:border-blue-500 transition-all text-sky-300 text-lg font-bold font-mono"
                      >
                        ×
                      </button>
                      <button
                        onClick={() => insertSymbol("/")}
                        className="w-11 h-11 bg-gray-900 border-2 border-blue-700 rounded hover:bg-blue-900/40 hover:border-blue-500 transition-all text-sky-300 text-lg font-bold font-mono"
                      >
                        ÷
                      </button>

                      <button
                        onClick={() => insertSymbol("^")}
                        className="w-11 h-11 bg-gray-900 border-2 border-blue-700 rounded hover:bg-blue-900/40 hover:border-blue-500 transition-all text-sky-300 text-lg font-bold font-mono"
                      >
                        ^
                      </button>
                      <button
                        onClick={() => insertSymbol("**")}
                        className="w-11 h-11 bg-gray-900 border-2 border-blue-700 rounded hover:bg-blue-900/40 hover:border-blue-500 transition-all text-sky-300 text-sm font-bold font-mono"
                      >
                        **
                      </button>
                      <button
                        onClick={() => insertSymbol("sqrt(")}
                        className="w-11 h-11 bg-gray-900 border-2 border-blue-700 rounded hover:bg-blue-900/40 hover:border-blue-500 transition-all text-sky-300 text-xs font-bold font-mono"
                      >
                        √
                      </button>
                      <button
                        onClick={() => insertSymbol("pi")}
                        className="w-11 h-11 bg-gray-900 border-2 border-blue-700 rounded hover:bg-blue-900/40 hover:border-blue-500 transition-all text-sky-300 text-lg font-bold font-mono"
                      >
                        π
                      </button>

                      <button
                        onClick={() => insertSymbol("(")}
                        className="w-11 h-11 bg-gray-900 border-2 border-gray-700 rounded hover:bg-gray-800 hover:border-blue-700 transition-all text-sky-300 text-lg font-bold font-mono"
                      >
                        (
                      </button>
                      <button
                        onClick={() => insertSymbol(")")}
                        className="w-11 h-11 bg-gray-900 border-2 border-gray-700 rounded hover:bg-gray-800 hover:border-blue-700 transition-all text-sky-300 text-lg font-bold font-mono"
                      >
                        )
                      </button>
                      <button
                        onClick={() => insertSymbol(".")}
                        className="w-11 h-11 bg-gray-900 border-2 border-gray-700 rounded hover:bg-gray-800 hover:border-blue-700 transition-all text-sky-300 text-lg font-bold font-mono"
                      >
                        .
                      </button>
                      <button
                        onClick={() => insertSymbol(",")}
                        className="w-11 h-11 bg-gray-900 border-2 border-gray-700 rounded hover:bg-gray-800 hover:border-blue-700 transition-all text-sky-300 text-lg font-bold font-mono"
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
                  className="flex-1 px-4 py-3 text-lg bg-gray-900 border-2 border-gray-700 rounded
                         focus:border-blue-500 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20
                         transition-all font-mono text-blue-400 placeholder:text-gray-600"
                />

                <button
                  onClick={() => handleCalculate(index)}
                  className="flex-shrink-0 w-12 h-12 bg-blue-900/50 border-2 border-blue-700 rounded-lg
                           hover:bg-blue-800/60 hover:border-blue-500 transition-all duration-200
                           flex items-center justify-center group"
                  title="计算结果"
                >
                  <Calculator className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                </button>

                <div className="flex-shrink-0 w-48">
                  {row.result !== null && (
                    <div className="text-sm text-blue-400 font-mono font-bold">
                      <span className="text-gray-500">&gt;</span> {row.value} = {row.result}
                    </div>
                  )}
                  {row.error && (
                    <div className="text-sm text-red-400 font-mono">✗ {row.error}</div>
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
