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

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/signin" />
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
          <Route path="/accounts" element={<ProtectedRoute element={<Accounts />} />} />
          <Route path="/createAccount" element={<ProtectedRoute element={<CreateAccount />} />} />
          <Route path="/editAccount/:id" element={<ProtectedRoute element={<CreateAccount />} />} />
          <Route path="/transactions" element={<ProtectedRoute element={<Transactions />} />} />
          {/* <Route path="/health-check" element={<HealthCheck />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App