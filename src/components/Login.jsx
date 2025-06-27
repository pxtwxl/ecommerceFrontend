import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Fade,
  Checkbox,
  FormControlLabel,
  Grid
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import API from "../axios";
import AppContext from "../Context/Context";

const backgroundStyle = {
  minHeight: "100vh",
  minWidth: "100vw",
  background: "linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
};

const svgStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  left: 0,
  top: 0,
  zIndex: 0,
  pointerEvents: "none"
};

const cardStyle = {
  width: 480,
  maxWidth: "96vw",
  borderRadius: 20,
  boxShadow: "0 8px 40px rgba(80,0,120,0.18)",
  overflow: "hidden",
  zIndex: 2,
  minHeight: 420,
};

const topSectionStyle = {
  background: "linear-gradient(135deg, #8f5cff 60%, #f357a8 100%)",
  padding: "32px 38px 28px 38px",
  color: "#fff",
  textAlign: "center",
  position: "relative",
};

const bottomSectionStyle = {
  background: "#fff",
  padding: "28px 38px 28px 38px",
};

const inputStyle = {
  borderRadius: 30,
  background: "#f3eaff",
};

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AppContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    localStorage.removeItem("token"); // Clear any previous token before login
    try {
      const response = await API.post("user/login", form);
      localStorage.setItem("token", response.data); // Store JWT token
      // Fetch userId as int and store in localStorage
      const profileRes = await API.get(`/user/profile/username/${form.username}`);
      if (profileRes.data) {
        localStorage.setItem("userId", profileRes.data);
      }
      login(); // Set isAuthenticated to true
      navigate("/");
    } catch (err) {
      setError("Login failed: " + (err.response?.data?.message || "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={backgroundStyle}>
      {/* SVG Background for mountains/clouds/stars */}
      <svg style={svgStyle} viewBox="0 0 1440 900" preserveAspectRatio="none">
        {/* Mountains */}
        <path fill="#6b23bb" fillOpacity="0.38" d="M0,700 Q400,600 800,800 Q1200,1000 1440,700 L1440,900 L0,900 Z" />
        <path fill="#4f1a7b" fillOpacity="0.32" d="M0,800 Q600,700 1200,850 Q1440,900 1440,900 L1440,900 L0,900 Z" />
        {/* Clouds */}
        <ellipse cx="220" cy="180" rx="60" ry="28" fill="#4f1a7b" fillOpacity="0.13" />
        <ellipse cx="1240" cy="120" rx="80" ry="36" fill="#4f1a7b" fillOpacity="0.13" />
        {/* Stars */}
        <circle cx="300" cy="100" r="2.5" fill="#fff" opacity="0.7" />
        <circle cx="900" cy="140" r="1.8" fill="#fff" opacity="0.7" />
        <circle cx="600" cy="70" r="1.8" fill="#fff" opacity="0.7" />
        {/* Shooting stars */}
        <rect x="400" y="80" width="60" height="2" rx="1" fill="#fff" opacity="0.27" transform="rotate(-20 400 80)" />
        <rect x="1100" y="200" width="40" height="2" rx="1" fill="#fff" opacity="0.19" transform="rotate(-15 1100 200)" />
      </svg>

      <Fade in timeout={700}>
        <Paper elevation={12} style={cardStyle}>
          {/* Top Section */}
          <div style={topSectionStyle}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ letterSpacing: 1, color: "#fff" }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{ opacity: 0.85, fontSize: 15, color: "#fff" }}
            >
              Login to your account to shop, connect and explore.<br />
              Enjoy exclusive deals and a seamless experience.
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#fff",
                  opacity: 0.85,
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
                onClick={() => navigate("/register")}
              >
                Don't have an account?
              </Typography>
            </Box>
          </div>
          {/* Bottom Section */}
          <div style={bottomSectionStyle}>
            <Typography
              variant="subtitle1"
              align="center"
              fontWeight="bold"
              sx={{ color: "#8f5cff", mb: 2, letterSpacing: 1.2 }}
            >
              USER LOGIN
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                required
                fullWidth
                placeholder="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#8f5cff" }} />
                    </InputAdornment>
                  ),
                  style: inputStyle,
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                required
                fullWidth
                placeholder="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#8f5cff" }} />
                    </InputAdornment>
                  ),
                  style: inputStyle,
                }}
                sx={{ mb: 2 }}
              />
              {error && (
                <Typography color="error" align="center" sx={{ mb: 1 }}>
                  {error}
                </Typography>
              )}
              <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Grid item>
                  <FormControlLabel
                    control={<Checkbox sx={{ color: "#8f5cff" }} />}
                    label={
                      <Typography sx={{ fontSize: 14, color: "#888" }}>
                        Remember
                      </Typography>
                    }
                  />
                </Grid>
                <Grid item>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#f357a8",
                      cursor: "pointer",
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                    onClick={() => alert("Forgot password flow")}
                  >
                    Forgot password?
                  </Typography>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  borderRadius: 30,
                  background: "linear-gradient(90deg, #8f5cff 60%, #f357a8 100%)",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  letterSpacing: 1,
                  py: 1.3,
                  boxShadow: 2,
                  "&:hover": {
                    background: "linear-gradient(90deg, #7b2ff2 60%, #f357a8 100%)"
                  }
                }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "LOGIN"}
              </Button>
            </Box>
          </div>
        </Paper>
      </Fade>
    </div>
  );
};

export default Login;
