import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_BASE_URL } from "../../utils/constants";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${APP_BASE_URL}/orders/${id}`, {
        withCredentials: true,
      });
      if (response.status === 401) {
        navigate("/login");
      }
      setOrder(response.data.order);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const getStatusBadgeColor = () => {
    switch (order?.status) {
      case "PENDING":
        return "badge-warning";
      case "ACCEPTED":
        return "badge-info";
      case "OUT_FOR_DELIVERY":
        return "badge-primary";
      case "DELIVERED":
        return "badge-success";
      default:
        return "badge-neutral";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto mt-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Order not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>
          <p className="mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="p-6">
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <div
              className={`badge ${getStatusBadgeColor()} badge-lg px-4 py-2`}
            >
              {order.status.replace(/_/g, " ")}
            </div>
            <span className="text-sm">
              Last updated: {new Date(order.updatedAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Customer & Delivery Partner Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Customer Card */}
            <div className="rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Customer</h2>
              <div className="flex items-center gap-4">
                <img
                  src={
                    order.customer?.photoUrl ||
                    "https://geographyandyou.com/images/user-profile.png"
                  }
                  alt="Customer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.target.src =
                      "https://geographyandyou.com/images/user-profile.png";
                  }}
                />
                <div>
                  <p className="font-medium">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                  <p className="text-sm">{order.customer?.email}</p>
                  {order.customer?.phone && (
                    <p className="text-sm mt-1">{order.customer.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Partner Card */}
            {order.deliveryPartner && (
              <div className="rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Delivery Partner</h2>
                <div className="flex items-center gap-4">
                  <img
                    src={
                      order.deliveryPartner?.photoUrl ||
                      "https://geographyandyou.com/images/user-profile.png"
                    }
                    alt="Delivery Partner"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.target.src =
                        "https://geographyandyou.com/images/user-profile.png";
                    }}
                  />
                  <div>
                    <p className="font-medium">
                      {order.deliveryPartner?.firstName}{" "}
                      {order.deliveryPartner?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.deliveryPartner?.email}
                    </p>
                    {order.deliveryPartner?.phone && (
                      <p className="text-sm text-gray-600 mt-1">
                        {order.deliveryPartner.phone}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full">
                      Delivery Partner
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Card */}
          <div className="border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Product Details</h2>
            <div className="flex items-center gap-4">
              <div className="rounded-lg p-3 flex items-center justify-center w-16 h-16">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium ">{order.product}</h3>
                <div className="flex justify-between mt-2 text-sm ">
                  <span>Quantity: {order.quantity}</span>
                  <span>Single Unit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="border rounded-lg p-5 mb-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Delivery Information</h2>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
