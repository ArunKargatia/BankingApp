import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext"
import Accounts from "./components/Accounts"
import HealthCheck from "./components/HealthCheck"
import Register from "./components/Register"
import SignIn from "./components/SignIn"
import Transactions from "./components/Transactions"
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import CreateTransaction from "./components/CreateTransaction";
import CustomerProfile from "./components/CustomerProfile";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />
}

function App() {

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
          <Route path="/createAccount" element={<ProtectedRoute><CreateAccount /></ProtectedRoute>} />
          <Route path="/editAccount/:id" element={<ProtectedRoute><CreateAccount /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/createTransaction" element={<ProtectedRoute><CreateTransaction /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
          <Route path="/health-check" element={<HealthCheck />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App