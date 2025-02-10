import React, { useEffect, useState } from "react";
import backendUrl from "../BackendUrlConfig";
import { useAuth } from "../AuthContext";
import { useLocation } from "react-router-dom";

const CreateTransaction = ({ onSuccess }) => {
  const { token } = useAuth();
  const location = useLocation();
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

    try {
      await backendUrl.post("/transaction", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Transaction successful!");
      setFormData({
        senderAccountNumber: accountNumber,
        receiverAccountNumber: "",
        amount: "",
        transactionType: "TRANSFER",
        description: "",
      });

      onSuccess(); 
    } catch (err) {
      setError("Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h3 className="text-2xl font-semibold text-center mb-6">Make a Transaction</h3>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">From Account</label>
            <input
              type="text"
              value={formData.senderAccountNumber}
              disabled
              className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">To Account</label>
            <input
              type="text"
              name="receiverAccountNumber"
              value={formData.receiverAccountNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Transaction Type</label>
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TRANSFER">TRANSFER</option>
              <option value="DEPOSIT">DEPOSIT</option>
              <option value="WITHDRAWAL">WITHDRAWAL</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-300"
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