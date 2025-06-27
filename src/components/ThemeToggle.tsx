import React from "react";
import { useTheme } from "../context/ThemeContext";
import { HiSun, HiMoon } from "react-icons/hi";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <HiSun size={20} color="#F6E05E" />
      ) : (
        <HiMoon size={20} color="#1F2937" />
      )}
    </button>
  );
};

export default ThemeToggle;
