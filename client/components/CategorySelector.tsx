"use client";
import React from "react";

export type Category = {
  title: string;
  icon: React.ReactNode;
  border: string;
};

interface CategorySelectorProps {
  categories: Category[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function CategorySelector({ categories, selected, onChange }: CategorySelectorProps) {
  const toggle = (title: string) => {
    if (selected.includes(title)) {
      onChange(selected.filter((t) => t !== title));
    } else {
      onChange([...selected, title]);
    }
  };
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {categories.map((cat) => (
        <button
          key={cat.title}
          type="button"
          className={`min-w-[140px] flex flex-col items-center justify-center rounded-2xl p-4 shadow transition-all border-2 focus:outline-none text-center text-sm font-semibold gap-2 ${cat.border} ${selected.includes(cat.title) ? "bg-pink-100 border-pink-400 scale-105" : "bg-white hover:bg-pink-50"}`}
          onClick={() => toggle(cat.title)}
        >
          <span className="text-2xl">{cat.icon}</span>
          <span>{cat.title}</span>
        </button>
      ))}
    </div>
  );
}
