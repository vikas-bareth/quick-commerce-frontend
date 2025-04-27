export const APP_BASE_URL = "http://localhost:7777";
export const LOGIN = "/auth/login";
export const LOGOUT = "/auth/logout";
export const GET_USER = "/auth/me";
export const SIGNUP = "/auth/register";
export const GET_CUSTOMER_ORDERS = "/orders/customer";
export const GET_ORDERS_HISTORY = "/orders/history";
export const CREATE_ORDER = "/orders";
export const GET_DELIVERY_STATS = "/orders";
export const GET_PENDING_ORDERS = "/orders/pending";
export const UPDATE_ORDER_STATUS = (id) => {
  return `/orders/${id}/status`;
};
export const GET_IN_PROGRESS_ORDERS = "/orders/in-progress";

export const LOGIN_IMG_URL =
  "https://images.unsplash.com/photo-1671209979438-ce4b32757ae1?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
