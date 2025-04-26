import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
      <div className="p-8 bg-base-100 rounded-lg shadow-md text-center border border-base-300">
        <h1 className="text-2xl font-bold text-error mb-4">
          403 - Access Denied
        </h1>
        <p className="mb-6 text-base-content">
          You don't have permission to view this page.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
