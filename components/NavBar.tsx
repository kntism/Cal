'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, Home } from 'lucide-react';

export default function NavBar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: '首页',
      path: '/',
      icon: <Home size={18} />
    },
    {
      name: '基本数学计算器',
      path: '/basic-math-cal',
      icon: <Calculator size={18} />
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Calculator className="text-blue-400" size={24} />
              <span className="text-xl font-bold text-blue-400">Calculator</span>
            </Link>
          </div>

          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
                      : 'text-gray-400 hover:text-blue-300 hover:bg-blue-900/30'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
