import React from 'react';
import { Sparkles, Scale, Stethoscope, Lightbulb } from 'lucide-react';

export type AlertType = 'key-difference' | 'clinical-pearls' | 'high-yield' | 'mnemonic';

interface MarkdownAlertProps {
  type: AlertType;
  children: React.ReactNode;
}

const alertConfig = {
  'key-difference': {
    icon: Scale,
    title: 'Key Difference',
    // Light: Soft Indigo | Dark: Brighter Indigo Border & Text, Lower Background Opacity
    styles: 'border-indigo-200 bg-indigo-50/80 text-indigo-900 dark:bg-indigo-500/10 dark:border-indigo-400/30 dark:text-indigo-100',
    iconColor: 'text-indigo-600 dark:text-indigo-300',
  },
  'clinical-pearls': {
    icon: Stethoscope,
    title: 'Clinical Pearl',
    // Light: Soft Teal | Dark: Brighter Teal
    styles: 'border-teal-200 bg-teal-50/80 text-teal-900 dark:bg-teal-500/10 dark:border-teal-400/30 dark:text-teal-100',
    iconColor: 'text-teal-600 dark:text-teal-300',
  },
  'high-yield': {
    icon: Sparkles,
    title: 'Key Fact',
    // Light: Soft Amber | Dark: Brighter Amber (Gold)
    styles: 'border-amber-200 bg-amber-50/80 text-amber-900 dark:bg-amber-500/10 dark:border-amber-400/30 dark:text-amber-100',
    iconColor: 'text-amber-600 dark:text-amber-300',
  },
  'mnemonic': {
    icon: Lightbulb,
    title: 'Mnemonic',
    // Light: Soft Pink | Dark: Brighter Pink
    styles: 'border-pink-200 bg-pink-50/80 text-pink-900 dark:bg-pink-500/10 dark:border-pink-400/30 dark:text-pink-100',
    iconColor: 'text-pink-600 dark:text-pink-300',
  },
};

export default function MarkdownAlert({ type, children }: MarkdownAlertProps) {
  const config = alertConfig[type] || alertConfig['high-yield'];
  const Icon = config.icon;

  return (
    <div className={`my-6 rounded-xl border p-4 ${config.styles} not-prose shadow-sm relative overflow-hidden`}>
      {/* Background Decor yang lebih halus di Dark Mode */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-current opacity-[0.05] dark:opacity-[0.1] rounded-full blur-xl pointer-events-none"></div>
      
      <div className="flex gap-3 relative z-10">
        <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
           <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h5 className={`font-black text-[10px] uppercase tracking-widest mb-1.5 ${config.iconColor}`}>
             {config.title}
          </h5>
          <div className="text-sm leading-relaxed font-medium opacity-95">
             {children}
          </div>
        </div>
      </div>
    </div>
  );
}