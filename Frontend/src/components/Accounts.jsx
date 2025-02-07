import React, { useEffect, useState } from "react";
import backendUrl from "../BackendUrlConfig";
import { useAuth} from "../AuthContext"
import { useNavigate } from "react-router-dom";

const Accounts = () => {

    const { token, isAuthenticated } = useAuth();
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

    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
              <p className="text-xl">Loading your accounts...</p>
            </div>
          </div>
        );
      }
    
      return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold text-center mb-4">Your Accounts</h2>
    
            {error ? (
              <p className="text-red-600 text-center mb-4">{error}</p>
            ) : accounts.length === 0 ? (
              <p className="text-center">No accounts found.</p>
            ) : (
              <ul>
                {accounts.map((account) => (
                  <li
                    key={account.id}
                    className="bg-gray-100 p-4 mb-2 rounded-md shadow-sm"
                  >
                    <p className="font-semibold">Account Number: {account.accountNumber}</p>
                    <p className="text-sm">Account Type: {account.accountType}</p>
                    <p className="text-sm">Balance: ${account.balance.toFixed(2)}</p>
                    <p className="text-sm">Account Created: {new Date(account.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm">Customer Name: {account.customer.name}</p>
                    <p className="text-sm">Customer Email: {account.customer.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
}

export default Accounts;