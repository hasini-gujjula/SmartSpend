import { useState } from "react";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8081/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      onLoginSuccess();
    } catch (error) {
      setMessage("Unable to connect to the server");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">


        <h1>SmartSpend</h1>

        <p className="auth-subtitle">
          Manage your money. Spend smarter.
        </p>

        <h2>Welcome Back!</h2>

        <p className="auth-description">
          Login to continue managing your expenses.
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
          >
            Login
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default Login;