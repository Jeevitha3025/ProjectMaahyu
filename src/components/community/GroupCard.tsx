import React from "react";

interface GroupCardProps {
  icon: string;
  name: string;
  description: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  icon,
  name,
  description,
  isSelected = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? "bg-rose-100 border-2 border-rose-400 shadow-md"
          : "bg-white hover:shadow-md border border-gray-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;