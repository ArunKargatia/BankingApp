import React, {useEffect, useState} from "react";
import {useAuth} from "../AuthContext";
import backendUrl from "../BackendUrlConfig";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreateTransaction from "./CreateTransaction";

const Transactions = () => {

    const { token, isAuthenticated, isDarkMode } = useAuth();
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const location = useLocation();
    const accountNumber = location.state?.accountNumber || "";

    useEffect(() => {

        if(!isAuthenticated) {
          navigate("/signin")
          return
        }

        const fetchTransactions = async () => {
            try {
                const response = await backendUrl.get("/transaction", {
                    headers: {Authorization: `Bearer ${token}`}
                })

                const filteredTransactions = response.data.filter(
                  (txn) => 
                    txn.senderAccountNumber === accountNumber || 
                    txn.receiverAccountNumber === accountNumber
                )
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                
                setTransactions(filteredTransactions)
            } catch (err) {
                setError("Failer to fetch transactions")
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions();
    }, [isAuthenticated, token, navigate, accountNumber])

    return (
      <div
          className={`${
              isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
          } flex justify-center items-center min-h-screen p-4`}
      >
          <div
              className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
              } p-6 rounded-lg shadow-md w-full max-w-4xl`}
          >
              <h2
                  className={`${
                      isDarkMode ? "text-white" : "text-gray-800"
                  } text-2xl font-bold text-center mb-4`}
              >
                  Your Transactions
              </h2>

              {error && (
                  <p
                      className={`${
                          isDarkMode ? "text-red-400" : "text-red-600"
                      } text-center mb-4`}
                  >
                      {error}
                  </p>
              )}
              {loading && <p className="text-center">Loading your transactions...</p>}

              <div className="text-center mb-6">
                  <button
                      onClick={() =>
                          navigate("/createTransaction", { state: { accountNumber } })
                      }
                      className={`${
                          isDarkMode ? "bg-blue-500" : "bg-blue-600"
                      } text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition duration-300`}
                  >
                      Transfer Funds
                  </button>
              </div>

              {loading ? (
                  <p className="text-center">Loading...</p>
              ) : transactions.length === 0 ? (
                  <p className="text-center">No transactions found.</p>
              ) : (
                  <ul>
                      {transactions.map((txn) => {
                          const isSender = txn.senderAccountNumber === accountNumber;
                          return (
                              <li
                                  key={txn.id}
                                  className={`${
                                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                                  } cursor-pointer p-4 mb-2 rounded-md shadow-sm flex justify-between items-center`}
                              >
                                  <div>
                                      <p className="font-semibold">From: {txn.senderAccountNumber}</p>
                                      <p className="font-semibold">To: {txn.receiverAccountNumber}</p>
                                      <p className="text-sm">{txn.transactionType}</p>
                                      <p className="text-sm">{txn.description}</p>
                                      <p className="text-sm text-gray-500">
                                          {new Date(txn.createdAt).toLocaleString()}
                                      </p>
                                  </div>
                                  <div className="flex gap-2">
                                      <span
                                          className={`font-semibold text-lg ${
                                              isSender ? "text-red-500" : "text-green-500"
                                          }`}
                                      >
                                          {isSender ? `- ₹${txn.amount}` : `+ ₹${txn.amount}`}
                                      </span>
                                  </div>
                              </li>
                          );
                      })}
                  </ul>
              )}
          </div>
      </div>
  );
};

export default Transactions;