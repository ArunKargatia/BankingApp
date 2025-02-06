import { AuthProvider } from "./AuthContext"
import Accounts from "./components/Accounts"
import HealthCheck from "./components/HealthCheck"
import Register from "./components/Register"
import SignIn from "./components/SignIn"

function App() {

  return (
    <AuthProvider>

      {/* <HealthCheck /> */}
      <SignIn />
      {/* <Register /> */}

      <Accounts />

    </AuthProvider>
  )
}

export default App
