import { Link } from "react-router-dom";

const StatsCard = ({ title, value, description, color = "neutral", link }) => {
  const colorClasses = {
    warning: "text-warning",
    info: "text-info",
    success: "text-success",
    neutral: "",
  };

  const content = (
    <div className="card-body">
      <h2 className={`card-title ${colorClasses[color]}`}>{title}</h2>
      <p className="text-4xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );

  return link ? (
    <Link
      to={link}
      className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
    >
      {content}
    </Link>
  ) : (
    <div className="card bg-base-100 shadow-md">{content}</div>
  );
};

export default StatsCard;
