"use client";

import { useState, useEffect } from "react";

export default function WebsiteTimer() {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // 网站开始时间：2025 年 10 月 27 日 22:00
    const startTime = new Date("2025-10-27T22:00:00").getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;

      // 计算天、小时、分钟、秒
      const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      setTimeElapsed({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <h2 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-6">
        网站已成功运行
      </h2>
      <div className="flex justify-center items-center gap-4 text-2xl font-mono">
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm">
          <span className="font-bold">{timeElapsed.days}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
            天
          </span>
        </div>
        <span className="text-gray-400">:</span>
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm">
          <span className="font-bold">
            {timeElapsed.hours.toString().padStart(2, "0")}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
            时
          </span>
        </div>
        <span className="text-gray-400">:</span>
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm">
          <span className="font-bold">
            {timeElapsed.minutes.toString().padStart(2, "0")}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
            分
          </span>
        </div>
        <span className="text-gray-400">:</span>
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm">
          <span className="font-bold">
            {timeElapsed.seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
            秒
          </span>
        </div>
      </div>
    </div>
  );
}
