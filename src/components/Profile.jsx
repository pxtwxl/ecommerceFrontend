import React, { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import { Avatar, Box, Button, Paper, TextField, Typography, Fade } from "@mui/material";
import API from "../axios"; // Adjust the import based on your API file location

const defaultProfilePic = "https://ui-avatars.com/api/?name=User&background=8f5cff&color=fff&size=128";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }
    API.get(`/user/profile/${userId}`)
      .then(res => {
        setUser(res.data);
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load user profile: " + (err.response?.data?.message || err.message));
        setLoading(false);
      });
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      // Optionally preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profileImg: reader.result.split(',')[1] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      let updatedUser = { ...form };
      let res;
      if (profileImageFile) {
        const formData = new FormData();
        formData.append("imageFile", profileImageFile);
        formData.append("user", new Blob([JSON.stringify({ ...form, profileImg: undefined })], { type: "application/json" }));
        res = await API.put(`user/profile/${form.id}/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await API.put(`/user/profile/${form.id}`, updatedUser);
      }
      // Immediately fetch the latest user data from backend after update
      const userId = localStorage.getItem("userId");
      const fresh = await API.get(`/user/profile/${userId}`);
      setUser(fresh.data);
      setForm(fresh.data);
      setProfileImageFile(null);
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography>Loading...</Typography></Box>;
  }
  if (error) {
    return <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)" }}>
      <Fade in timeout={700}>
        <Paper elevation={12} sx={{ p: 5, borderRadius: 4, minWidth: 350, maxWidth: 400, textAlign: "center" }}>
          <Avatar src={user?.profileImg ? `data:image/jpeg;base64,${user.profileImg}` : defaultProfilePic} sx={{ width: 96, height: 96, mx: "auto", mb: 2 }} />
          {editMode ? (
            <>
              <Button
                variant="outlined"
                component="label"
                sx={{ mb: 2 }}
              >
                Upload Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              <TextField
                label="Username"
                name="username"
                value={form?.username || ""}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                name="email"
                value={form?.email || ""}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Address"
                name="address"
                value={form?.address || ""}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Phone"
                name="phone"
                value={form?.phone || ""}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Role"
                name="role"
                value={form?.role || ""}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Profile Picture URL"
                name="profilePic"
                value={form?.profilePic || ""}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ borderRadius: 3, px: 4, mb: 2 }}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" sx={{ borderRadius: 3, px: 4 }} onClick={() => alert('Change password functionality coming soon!')}>
                Change Password
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                {user.username}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {user.email}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Address: {user.address || "-"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Phone: {user.phone || "-"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Role: {user.role || "-"}
              </Typography>
              <Button variant="outlined" color="primary" onClick={handleEdit} sx={{ borderRadius: 3, px: 4, mb: 2 }}>
                Edit
              </Button>
              <Button variant="outlined" color="secondary" sx={{ borderRadius: 3, px: 4 }} onClick={() => alert('Change password functionality coming soon!')}>
                Change Password
              </Button>
            </>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};

export default Profile;
