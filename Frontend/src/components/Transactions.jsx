import React, {useEffect, useState} from "react";
import {useAuth} from "../AuthContext";
import backendUrl from "../BackendUrlConfig";
import { useNavigate } from "react-router-dom";

const Transactions = () => {

    const {token, isAuthenticated} = useAuth();
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate();

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
                setTransactions(response.data)
            } catch (err) {
                setError("Failer to fetch transactions")
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions();
    }, [isAuthenticated, token, navigate])

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-4">Transactions</h2>
  
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {loading && <p className="text-gray-600 text-center">Loading...</p>}
  
          {!loading && transactions.length === 0 && (
            <p className="text-gray-500 text-center">No transactions found.</p>
          )}
  
          {!loading && transactions.length > 0 && (
            <ul className="space-y-3 max-h-[600px] overflow-y-auto">
              {transactions.map((txn) => (
                <li key={txn.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>From: {txn.senderAccountNumber}</span>
                    <span>To: {txn.receiverAccountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-500 text-sm">{txn.transactionType}</span>
                    <span
                      className={`font-semibold text-lg ${
                        txn.amount < 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {txn.amount < 0
                        ? `- ₹${Math.abs(txn.amount)}`
                        : `+ ₹${txn.amount}`}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1 text-sm">{txn.description}</p>
                  <span className="text-gray-400 text-xs">
                    {new Date(txn.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
}

export default Transactions;