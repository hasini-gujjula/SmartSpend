import { useState } from "react";
import { API_BASE_URL } from "./api";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setMessage(Object.values(data.errors).join(", "));
        } else {
          setMessage(data.message || "Registration failed");
        }
        return;
      }

      setMessage("Registration successful!");

      setFullName("");
      setEmail("");
      setPassword("");
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

        <h2>Create Account</h2>

        <p className="auth-description">
          Start tracking your expenses today.
        </p>

        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

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
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
          >
            Create Account
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

export default Register;