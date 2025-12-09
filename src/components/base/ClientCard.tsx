// ClientCard.tsx
import React from "react";

interface ClientCardProps {
  text: string;
  name: string;
  rating: number; // 0 to 5
}

const ClientCard: React.FC<ClientCardProps> = ({ text, name, rating }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between w-full h-full">
      <p className="text-gray-700 mb-4">{text}</p>
      <div className="flex items-center justify-between">
        <span className="text-gray-900 font-medium">{name}</span>
        <div className="flex gap-1 text-purple-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < rating ? "★" : "☆"}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
