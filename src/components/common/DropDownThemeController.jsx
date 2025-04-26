import React, { useState, useEffect } from "react";

const DropdownThemeController = () => {
  const themes = ["default", "retro", "cyberpunk", "valentine", "aqua"];
  const [selectedTheme, setSelectedTheme] = useState("default");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }, [selectedTheme]);

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  return (
    <div className="dropdown mb-72">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl"
      >
        {themes.map((theme) => (
          <li key={theme}>
            <label className="w-full btn btn-sm btn-ghost justify-start">
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller"
                aria-label={theme}
                value={theme}
                checked={selectedTheme === theme}
                onChange={handleThemeChange}
              />
              {theme.charAt(0).toUpperCase() + theme.slice(1)}{" "}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownThemeController;
