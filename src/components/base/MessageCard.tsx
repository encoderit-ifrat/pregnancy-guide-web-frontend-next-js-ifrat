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
      <div className="w-29 h-29 flex items-center justify-center  bg-primary rounded-full">
        {/* Inner Circle with icon */}
        <div className="w-27 h-27 flex items-center justify-center  bg-secondary text-white rounded-full p-4 border-2">
          {icon}
        </div>
      </div>

      {/* Title and Description */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-secondary">{title}</h3>
        <p className="text-text-gray">{description}</p>
      </div>
    </div>
  );
};

export default MessageCard;
