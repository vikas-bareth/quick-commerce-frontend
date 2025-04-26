import React, { useEffect, useState } from "react";
import ThemeController from "./common/ThemeController";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { APP_BASE_URL, LOGOUT } from "../utils/constants";
import LOGO_IMAGE from "../../public/favicon.ico";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [totalRequests, setTotalRequests] = useState(0);
  const handleLogout = async () => {
    await axios.post(
      APP_BASE_URL + LOGOUT,
      {},
      {
        withCredentials: true,
      }
    );
    dispatch(removeUser());
    navigate("/login");
  };

  const user = useSelector((state) => state.user);
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl">
          <div className="h-full overflow-hidden">
            <img src={LOGO_IMAGE} className="h-20 -mt-5" />
          </div>
        </Link>
      </div>
      {user && (
        <div className="flex-none mx-5">
          <div className="dropdown me-5">
            <>Welcome, {user.firstName ? user.firstName : "User"}</>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={"/profile"} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link onClick={handleLogout}>Logout</Link>
              </li>
              <li>
                <a>
                  <span>Change Theme:</span>
                  <ThemeController />
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
