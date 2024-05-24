import React from "react";

type Props = {
  title: string;
  icon: React.JSX.Element;
};

export default function CategoryCard({ title, icon }: Props) {
  return (
    <div className="p-4 aspect-square grid grid-cols-1 place-items-center rounded-xl border hover:bg-gray-200 transition-all duration-300">
      {icon}
      <h1 className="text-sm text-wrap">{title}</h1>
    </div>
  );
}
