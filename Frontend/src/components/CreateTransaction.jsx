import React, { useEffect, useState } from "react";
import backendUrl from "../BackendUrlConfig";
import { useAuth } from "../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const CreateTransaction = () => {
  const { token, isDarkMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const accountNumber = location.state?.accountNumber || "";

  const [formData, setFormData] = useState({
    senderAccountNumber: accountNumber,
    receiverAccountNumber: "",
    amount: "",
    transactionType: "TRANSFER",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if(!accountNumber) {   
        setError("Account not found.") 
    }
    }, [accountNumber]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.receiverAccountNumber || !formData.amount) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await backendUrl.post("/transaction", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Transaction successful!");

      setTimeout(() => {
        alert("Transaction successful!")
        navigate("/transactions", { state: { accountNumber } });
        }, 100);

      setFormData({
        senderAccountNumber: accountNumber,
        receiverAccountNumber: "",
        amount: "",
        transactionType: "TRANSFER",
        description: "",
      });
    } catch (err) {
        console.error("Transaction Error:", err.response?.data || err.message);
        setError("Transaction failed.");
        setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } flex justify-center items-center min-h-screen p-4`}
    >
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-lg shadow-md w-full max-w-lg`}
      >
        <h3
          className={`${
            isDarkMode ? "text-white" : "text-gray-800"
          } text-2xl font-semibold text-center mb-6`}
        >
          Make a Transaction
        </h3>
        {error && (
          <p className={`${
            isDarkMode ? "text-red-400" : "text-red-500"
          } text-center mb-4`}>{error}</p>
        )}
        {success && (
          <p className={`${
            isDarkMode ? "text-green-400" : "text-green-500"
          } text-center mb-4`}>{success}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } text-sm mb-1`}
            >
              From Account
            </label>
            <input
              type="text"
              value={formData.senderAccountNumber}
              disabled
              className={`${
                isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
              } w-full p-3 border border-gray-300 rounded`}
            />
          </div>

          <div className="mb-4">
            <label
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } text-sm mb-1`}
            >
              To Account
            </label>
            <input
              type="text"
              name="receiverAccountNumber"
              value={formData.receiverAccountNumber}
              onChange={handleChange}
              className={`${
                isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
              } w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } text-sm mb-1`}
            >
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`${
                isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
              } w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } text-sm mb-1`}
            >
              Transaction Type
            </label>
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              className={`${
                isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
              } w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="TRANSFER">TRANSFER</option>
              <option value="DEPOSIT">DEPOSIT</option>
              <option value="WITHDRAWAL">WITHDRAWAL</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } text-sm mb-1`}
            >
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`${
                isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
              } w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <button
            type="submit"
            className={`${
              isDarkMode ? "bg-blue-500" : "bg-blue-600"
            } w-full text-white p-3 rounded hover:bg-blue-700 transition duration-300`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Send Money"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTransaction;