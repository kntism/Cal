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
      icon: <Calculator size={48} className="text-blue-600" />
    }
  ];

  return (
    <div>
      <main className="pt-24 pb-16">
        <WebsiteTimer />
        <div className="text-center mt-8 mb-12">
          <div className="text-gray-600">by {name}</div>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            选择一个计算器
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc) => (
              <Link
                key={calc.path}
                href={calc.path}
                className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg
                         transition-shadow border border-gray-200 hover:border-blue-300
                         group"
              >
                <div className="flex flex-col items-center text-center">
                  {calc.icon}
                  <h3 className="mt-4 text-xl font-semibold text-gray-900
                               group-hover:text-blue-600 transition-colors">
                    {calc.name}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    {calc.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
