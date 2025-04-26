import axios from "axios";
import { APP_BASE_URL, GET_USER } from "./constants";

export const fetchUserProfile = async () => {
  return await axios.get(APP_BASE_URL + GET_USER, { withCredentials: true });
};

export const handleLogout = async () => {
  return await axios.post(
    APP_BASE_URL + LOGOUT,
    {},
    {
      withCredentials: true,
    }
  );
};
