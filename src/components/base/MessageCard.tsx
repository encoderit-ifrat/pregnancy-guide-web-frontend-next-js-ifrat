import React from "react";

type MessageCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const MessageCard: React.FC<MessageCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      {/* Outer Circle */}
      <div className="w-29 h-29 flex items-center justify-center  bg-[#A080E1] rounded-full">
        {/* Inner Circle with icon */}
        <div className="w-27 h-27 flex items-center justify-center  bg-[#3D3177] text-white rounded-full p-4 border-2">
          {icon}
        </div>
      </div>

      {/* Title and Description */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-[#3D3177]">{title}</h3>
        <p className="text-[#323232]">{description}</p>
      </div>
    </div>
  );
};

export default MessageCard;
