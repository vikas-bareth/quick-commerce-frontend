import { useNavigate } from "react-router-dom";

const GoToHomeButton = ({
  className = "",
  variant = "primary",
  label = "Home",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <button
      onClick={handleClick}
      className={`btn btn-${variant} ${className}`}
      aria-label="Go to home"
    >
      {label}
    </button>
  );
};

export default GoToHomeButton;
