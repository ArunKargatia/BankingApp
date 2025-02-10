import React, {useEffect, useState} from "react";
import {useAuth} from "../AuthContext";
import backendUrl from "../BackendUrlConfig";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreateTransaction from "./CreateTransaction";

const Transactions = () => {

    const {token, isAuthenticated} = useAuth();
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-4">Your Transactions</h2>
  
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {loading && <p className="text-center">Loading your transactions...</p>}
  
          <div className="text-center mb-6">
            <button
              onClick={() =>
                navigate("/createTransaction", { state: { accountNumber } })
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
            >
              Make a Transaction
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
                    className="cursor-pointer bg-gray-100 p-4 mb-2 rounded-md shadow-sm flex justify-between items-center"
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