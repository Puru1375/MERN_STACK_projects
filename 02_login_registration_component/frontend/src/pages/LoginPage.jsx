import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  const navigate = useNavigate();

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
    },
    formContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(10px)",
      transform: "translateY(0)",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
      },
      width: "100%",
      maxWidth: "400px",
    },
    title: {
      textAlign: "center",
      color: "#333",
      marginBottom: "30px",
      fontSize: "2rem",
      fontWeight: "600",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      color: "#555",
      fontSize: "0.9rem",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "2px solid #e1e1e1",
      borderRadius: "8px",
      fontSize: "1rem",
      marginBottom: "8px",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
      outline: "none",
      "&:focus": {
        borderColor: "#667eea",
        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
      },
    },
    button: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient(to right, #667eea, #764ba2)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      transform: "scale(1)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    },
    message: {
      textAlign: "center",
      marginTop: "20px",
      padding: "10px",
      borderRadius: "4px",
      backgroundColor: "#f8d7da",
      color: "#721c24",
    },
    successMessage: {
      backgroundColor: "#d4edda",
      color: "#155724",
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setMessage(res.data.message);
      navigate("/profile");
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.02)";
              e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
            }}
          >
            Sign In
          </button>
        </form>
        {message && (
          <div
            style={{
              ...styles.message,
              ...(message.includes("successfully")
                ? styles.successMessage
                : {}),
            }}
          >
            {message}
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: "15px", color: "#555" }}>
          Create an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
