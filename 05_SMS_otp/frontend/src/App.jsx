import { useState } from "react";
import axios from "axios";

function App() {
  const [step, setStep] = useState("register");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [code, setCode] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/send-otp", { phone: form.phone });
      alert("OTP sent!");
      setStep("verify");
    } catch (err) {
      alert(err.response?.data?.error || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", { ...form, code });
      if (res.data.verified) {
        alert("User registered successfully ✅");
        console.log(res.data.user);
      } else {
        alert("Invalid OTP ❌");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Error verifying OTP");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {step === "register" && (
        <>
          <h2>Register</h2>
          <input name="name" placeholder="Name" onChange={handleChange} /><br />
          <input name="email" placeholder="Email" onChange={handleChange} /><br />
          <input name="phone" placeholder="+91XXXXXXXXXX" onChange={handleChange} /><br />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === "verify" && (
        <>
          <h2>Verify OTP</h2>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter OTP" /><br />
          <button onClick={verifyOtp}>Verify & Register</button>
        </>
      )}
    </div>
  );
}

export default App;
