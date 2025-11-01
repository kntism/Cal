import Link from 'next/link';
import WebsiteTimer from "../components/WebsiteTimer";
import { Calculator } from 'lucide-react';

export default function Home() {
  const name = "Lu & Sun";

  const calculators = [
    {
      name: '基本数学计算器',
      description: '支持基本四则运算，按回车键快速计算',
      path: '/basic-math-cal',
      icon: <Calculator size={48} className="text-blue-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-400">
            选择一个计算器
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc) => (
              <Link
                key={calc.path}
                href={calc.path}
                className="block p-6 bg-gray-900 rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-500/20
                         transition-all border border-gray-800 hover:border-blue-700
                         group"
              >
                <div className="flex flex-col items-center text-center">
                  {calc.icon}
                  <h3 className="mt-4 text-xl font-semibold text-blue-400
                               group-hover:text-blue-300 transition-colors">
                    {calc.name}
                  </h3>
                  <p className="mt-2 text-gray-400 text-sm">
                    {calc.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 border-t border-gray-800">
        <WebsiteTimer />
        <div className="mt-2 text-sm text-gray-500">by {name}</div>
      </footer>
    </div>
  );
}
