
import React from 'react';
import { Logo } from './Logo';

interface LoaderProps {
  fullScreen?: boolean;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ fullScreen = true, className = "" }) => {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      <div className="relative">
         {/* Background pulse effect */}
         <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-ping opacity-20 duration-1000"></div>
         
         {/* Logo Container */}
         <div className="relative h-20 w-20 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center border border-slate-100 dark:border-slate-700 z-10">
            <Logo className="text-primary animate-float" size={40} />
         </div>
      </div>
      
      <div className="text-center space-y-1">
        <h3 className="font-bold text-slate-800 dark:text-white text-lg tracking-tight">Receipt Book</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
        {content}
      </div>
    );
  }

  return <div className="w-full flex items-center justify-center py-20">{content}</div>;
};
