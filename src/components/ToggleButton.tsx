import React from "react";

interface ToggleProps {
  isToggledOn: boolean;
  onToggle: () => void;
  labelOn: string;
  labelOff: string;
}

const Toggle: React.FC<ToggleProps> = ({
  isToggledOn,
  onToggle,
  labelOn,
  labelOff,
}) => {
  return (
    <div className="flex items-center justify-center">
      {/* Toggle Switch */}
      <label className="relative inline-flex items-center cursor-pointer group">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isToggledOn}
          onChange={onToggle}
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-800 border-2 border-[#FFFFF0]"></div>
      </label>

      {/* Button */}
      <button
        onClick={onToggle}
        className="toggle-button px-4 py-2 relative group"
      >
        {isToggledOn ? labelOn : labelOff}
      </button>
    </div>
  );
};

export default Toggle;
