import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  const [page, setPage] = useState("login");

  const handleLoginSuccess = () => {
    setPage("dashboard");
  };

  if (page === "dashboard") {
    return <Dashboard />;
  }

  return (
    <div>
      {page === "login" ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Register />
      )}

      <div className="auth-switch">
        <button
          onClick={() =>
            setPage(page === "login" ? "register" : "login")
          }
        >
          {page === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default App;