import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [step, setStep] = useState("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    },
    formContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      transform: 'translateY(0)',
      transition: 'all 0.3s ease-in-out',
      animation: 'fadeIn 0.5s ease-out',
      width: '100%',
      maxWidth: '400px'
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '30px',
      fontSize: '2rem',
      fontWeight: '600'
    },
    subtitle: {
      textAlign: 'center',
      color: '#666',
      marginBottom: '25px',
      fontSize: '1rem'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#555',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e1e1e1',
      borderRadius: '8px',
      fontSize: '1rem',
      marginBottom: '8px',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      '&:focus': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
        backgroundColor: 'white'
      }
    },
    button: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(to right, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      transform: 'scale(1)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      marginTop: '10px'
    },
    message: {
      textAlign: 'center',
      marginTop: '20px',
      padding: '10px',
      borderRadius: '4px',
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    loginLink: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#666'
    },
    link: {
      color: '#555',
    },
    otpContainer: {
      textAlign: 'center'
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      setStep("verify");
      setLoading(false);
      setMessage("Check your email for OTP");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      setMessage("Verified ✅ Now you can login");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.error || "OTP failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        {step === "register" ? (
          <>
            <h1 style={styles.title}>Create Account</h1>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            <button 
              onClick={handleRegister} 
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </>
        ) : (
          <div style={styles.otpContainer}>
            <h1 style={styles.title}>Verify Your Email</h1>
            <p style={styles.subtitle}>Please enter the OTP sent to your email</p>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>OTP Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
                maxLength={6}
              />
            </div>

            <button 
              onClick={handleVerify} 
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes('✅') || message.includes('Check') ? styles.successMessage : {})
          }}>
            {message}
          </div>
        )}

        <div style={styles.loginLink}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
