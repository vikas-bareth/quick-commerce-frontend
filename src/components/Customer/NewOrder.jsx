import React, { useState } from "react";
import axios from "axios";
import { APP_BASE_URL, CREATE_ORDER } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 999.99 },
  { id: 2, name: "Smartphone", price: 699.99 },
  { id: 3, name: "Headphones", price: 149.99 },
];

const NewOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product: "",
    quantity: 1,
    deliveryAddress: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.product || !formData.deliveryAddress) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        APP_BASE_URL + CREATE_ORDER,
        {
          product: formData.product,
          quantity: formData.quantity,
          deliveryAddress: formData.deliveryAddress,
        },
        { withCredentials: true }
      );

      // Show success modal with order details
      setOrderDetails(response.data);
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        product: "",
        quantity: 1,
        deliveryAddress: "",
      });
    } catch (err) {
      console.error("Error creating order:", err);
      setError(err.response?.data?.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/customer"); // Redirect after modal closes
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={handleCloseModal}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">
            Order Placed Successfully!
          </h3>
          {orderDetails && (
            <div className="text-left my-4 space-y-2">
              <p>
                <span className="font-semibold">Order ID:</span> #
                {orderDetails.id?.slice(-6)}
              </p>
              <p>
                <span className="font-semibold">Product:</span>{" "}
                {orderDetails.product}
              </p>
              <p>
                <span className="font-semibold">Quantity:</span>{" "}
                {orderDetails.quantity}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className="badge badge-success">
                  {orderDetails.status}
                </span>
              </p>
            </div>
          )}
          <button onClick={handleCloseModal} className="btn btn-primary mt-4">
            Continue
          </button>
        </div>
      </Modal>

      {/* Order Form */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h1 className="card-title text-2xl font-bold mb-6">
            Place New Order
          </h1>

          {error && (
            <div className="alert alert-error mb-6">
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
          )}

          <form onSubmit={handleSubmit}>
            {/* Product Selection */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Select Product</span>
              </label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Choose a product</option>
                {PRODUCTS.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name} - ${product.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Quantity</span>
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Delivery Address */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-semibold">
                  Delivery Address
                </span>
              </label>
              <input
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter full delivery address"
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
