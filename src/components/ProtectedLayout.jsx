import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { fetchUserProfile } from "../utils/auth";
import { addUser, removeUser } from "../utils/userSlice";

const ProtectedLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    const controller = new AbortController();

    const verifyAuth = async () => {
      try {
        const { data } = await fetchUserProfile();
        dispatch(addUser(data));
      } catch (error) {
        if (!controller.signal.aborted) {
          dispatch(removeUser());
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    if (!user) verifyAuth();

    return () => controller.abort();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
