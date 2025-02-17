import React, { useEffect, useState } from "react";
import backendUrl from "../BackendUrlConfig";
import { useAuth} from "../AuthContext"
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaExchangeAlt } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';

const Accounts = () => {

    const { token, isAuthenticated, isDarkMode } = useAuth();
    const [accounts, setAccounts] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAccounts = async () => {

            if (!isAuthenticated) {
                setError("User is not authenticated.")
                navigate("/signin")
                return;
            }

            try {
                const response = await backendUrl.get('/account', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setAccounts(response.data)
                setLoading(false)
            } catch (err) {
                setError("Failed to fetch accounts.")
                setLoading(false)
            }
        }

        if (token) {
            fetchAccounts();
        }
    }, [token, isAuthenticated, navigate])

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure ypu want to delte this account?")){
            return;
        }

        try {
            await backendUrl.delete(`/account/id/${id}`, {
                headers: { Authorization: `Bearer ${token}`}
            })

            setAccounts(accounts.filter(account => account.id !== id));

            alert("Account deleted successfully!")
        } catch (err) {
            alert("Failed to delete account.")
        }
    }

    const handleAccountClick = (account) => {
        navigate("/transactions", {state: {accountNumber: account.accountNumber}})
    }

    return (
      <div
        className={`flex justify-center items-center min-h-screen p-4 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <div
          className={`p-6 rounded-lg shadow-md w-full max-w-4xl ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2
            className={`text-2xl font-bold text-center mb-4 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Your Accounts
          </h2>
  
          {error && (
            <p
              className={`text-red-600 text-center mb-4 ${
                isDarkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              {error}
            </p>
          )}
  
          <div className="text-center mb-6">
            <button
              onClick={() => navigate("/createAccount")}
              className={`${
                isDarkMode ? "bg-green-500" : "bg-green-600"
              } text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300`}
            >
              Create New Account
            </button>
          </div>
  
          {loading ? (
            <p className="text-center">Loading your accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="text-center">No accounts found.</p>
          ) : (
            <ul>
              {accounts.map((account) => (
                <li
                  key={account.id}
                  onClick={() => handleAccountClick(account)}
                  className={`cursor-pointer p-4 mb-2 rounded-md shadow-sm flex justify-between items-center ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div>
                    <p
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Account Number: {account.accountNumber}
                    </p>
                    <p className="text-sm">Account Type: {account.accountType}</p>
                    <p className="text-sm">Balance: ₹{account.balance.toFixed(2)}</p>
                    <p className="text-sm">
                      Created: {new Date(account.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      Customer: {account.customer.name} ({account.customer.email})
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editAccount/${account.id}`);
                      }}
                      className={`${
                        isDarkMode ? "bg-blue-500" : "bg-blue-600"
                      } text-white p-3 rounded-md hover:bg-blue-700 transition duration-300`}
                      data-tooltip-id="edit-tooltip"
                      data-tooltip-content="Edit Account"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(account.id);
                      }}
                      className={`${
                        isDarkMode ? "bg-red-500" : "bg-red-600"
                      } text-white p-3 rounded-md hover:bg-red-700 transition duration-300`}
                      data-tooltip-id="delete-tooltip"
                      data-tooltip-content="Delete Account"
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/transactions", {
                          state: { accountNumber: account.accountNumber },
                        });
                      }}
                      className={`${
                        isDarkMode ? "bg-yellow-500" : "bg-yellow-600"
                      } text-white p-3 rounded-md hover:bg-yellow-700 transition duration-300`}
                      data-tooltip-id="transactions-tooltip"
                      data-tooltip-content="View Transactions"
                    >
                      <FaExchangeAlt />
                    </button>
                  </div>
                  <Tooltip id="edit-tooltip" />
                  <Tooltip id="delete-tooltip" />
                  <Tooltip id="transactions-tooltip" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };
    
export default Accounts;