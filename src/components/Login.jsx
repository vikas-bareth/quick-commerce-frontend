import React, { useState } from "react";
import SideImageCard from "./common/SideImageCard";
import UserNameInput from "./common/Inputs/UserNameInput";
import PasswordInput from "./common/Inputs/PasswordInput";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { APP_BASE_URL, LOGIN, LOGIN_IMG_URL } from "../utils/constants";

const Login = () => {
  const [userName, setUserName] = useState("customer@test.com");
  const [userPassword, setUserPassword] = useState("123456");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    if (!userName || !userPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        APP_BASE_URL + LOGIN,
        {
          email: userName,
          password: userPassword,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setErrorMessage("");
        dispatch(addUser(response.data.user));
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials or server error.";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="max-w-md w-full">
        <SideImageCard
          card_title="Welcome Back"
          card_description="Signup or login to use the app."
          card_image_url={LOGIN_IMG_URL}
        >
          <div className="flex flex-col gap-6">
            <UserNameInput value={userName} setValue={setUserName} />
            <PasswordInput value={userPassword} setValue={setUserPassword} />
            {errorMessage && (
              <p className="text-sm text-red-700 text-center">{errorMessage}</p>
            )}
            <div className="text-center">
              <button
                className={`btn btn-primary w-full ${
                  isLoading ? "loading" : ""
                }`}
                onClick={handleLoginClick}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 underline">
                Sign Up
              </Link>
            </p>
          </div>
        </SideImageCard>
      </div>
    </div>
  );
};

export default Login;
