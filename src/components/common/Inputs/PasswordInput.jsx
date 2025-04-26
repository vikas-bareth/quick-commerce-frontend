import React, { useState } from "react";

const PasswordInput = ({ value, setValue }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="input validator flex items-center relative">
        <svg
          className="h-[1em] opacity-50 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type={showPassword ? "text" : "password"}
          required
          placeholder="Password"
          minLength="4"
          pattern="(?=.*[a-zA-Z]).{4,}"
          title="Must be more than 4 characters, including number, lowercase letter, uppercase letter"
          className="flex-grow"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-gray-600 hover:text-gray-400 hover:cursor-pointer"
            >
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5.05 0-9.27-3.14-11-7a11.82 11.82 0 0 1 2.31-3.4"></path>
              <path d="M12 5c4.42 0 8 3.58 8 8a8.91 8.91 0 0 1-.86 3.65"></path>
              <path d="M9.41 9.41a4.58 4.58 0 0 1 6.59 0"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-gray-600 hover:text-gray-400 hover:cursor-pointer"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
        </button>
      </label>
      <p className="validator-hint hidden">
        Must be at least 4 characters long!
      </p>
    </div>
  );
};

export default PasswordInput;
