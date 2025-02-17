import React, {useState, useEffect} from "react";
import backendUrl from "../BackendUrlConfig";
import { useAuth } from "../AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const CreateAccount = () => {
    const { token, isDarkMode } = useAuth();
    const [accountData, setAccountData] = useState({
        accountNumber: '',
        accountType: 'savings',
        balance:'',
    })
    const { id } = useParams()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            const fetchAccount = async () => {
                try {
                    const response = await backendUrl.get(`/account/id/${id}`, {
                        headers: { Authorization: `Bearer ${token}`}
                    })
                    setAccountData(response.data)
                } catch (err) {
                    setError("Failed to load account details.")
                }
            }
            fetchAccount()
        }
    }, [id, token])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccountData((prevAccount) => ({
            ...prevAccount,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (accountData.balance < 0) {
            setError("Balance cannot be less than 0.");
            setLoading(false);
            return;
        }

        try {
            if (id) {
                await backendUrl.put(`/account/id/${id}`, accountData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Account updated successfully!");
            } else {
                await backendUrl.post("/account", accountData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Account created successfully!");
            }
            navigate("/accounts");
        } catch (err) {
            setError(id ? "Failed to update account." : "Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
          className={`${
            isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
          } flex justify-center items-center h-screen`}
        >
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-md w-96`}
          >
            <h2
              className={`${
                isDarkMode ? "text-white" : "text-gray-800"
              } text-2xl font-bold text-center mb-4`}
            >
              {id ? "Update Account" : "Create New Account"}
            </h2>
    
            {error && <p className={`${
              isDarkMode ? "text-red-400" : "text-red-600"
            } text-center mb-4`}>{error}</p>}
    
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } text-sm font-medium`}
                >
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={accountData.accountNumber}
                  onChange={handleInputChange}
                  className={`${
                    isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                  } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={id} // Disable editing account number when updating
                  required
                />
              </div>
    
              <div className="mb-4">
                <label
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } text-sm font-medium`}
                >
                  Account Type
                </label>
                <input
                  type="text"
                  name="accountType"
                  value={accountData.accountType}
                  onChange={handleInputChange}
                  className={`${
                    isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                  } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
    
              <div className="mb-6">
                <label
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } text-sm font-medium`}
                >
                  Balance
                </label>
                <input
                  type="number"
                  name="balance"
                  value={accountData.balance}
                  onChange={handleInputChange}
                  className={`${
                    isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                  } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
    
              <div className="text-center">
                <button
                  type="submit"
                  className={`${
                    isDarkMode ? "bg-blue-500" : "bg-blue-600"
                  } w-full py-2 px-4 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={loading}
                >
                  {loading ? (id ? "Updating Account..." : "Creating Account...") : (id ? "Update Account" : "Create Account")}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };

export default CreateAccount;