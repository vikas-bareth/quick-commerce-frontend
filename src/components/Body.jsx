import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { APP_BASE_URL, GET_USER } from "../utils/constants";
import { addUser, removeUser } from "../utils/userSlice";
import Navbar from "./Navbar";

const Body = () => {
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const user = await axios.get(APP_BASE_URL + GET_USER, {
        withCredentials: true,
      });
      if (user.status === 401) {
        dispatch(removeUser());
        navigate("/login");
      }
      dispatch(addUser(user.data));

      return;
    } catch (error) {
      console.error("error in fetch user:", error);
      return navigate("/login");
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Body;
