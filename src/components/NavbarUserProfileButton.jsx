import React, { useContext, useEffect, useRef } from "react";
import AppContext from "../Context/Context";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const defaultProfilePic = "https://ui-avatars.com/api/?name=User&background=8f5cff&color=fff&size=128";

const NavbarUserProfileButton = () => {
  const { user, setUser } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user only if not present in context
  useEffect(() => {
    if (user) return;
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    import("../axios").then(({ default: API }) => {
      API.get(`/user/profile/${userId}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => setUser(null));
    });
  }, [user, setUser]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', zIndex: 2000 }}>
      <span
        className="btn btn-outline-secondary ms-3"
        style={{ borderRadius: "50%", padding: 0, width: 44, height: 44, overflow: "hidden", display: 'inline-block', cursor: 'pointer', border: '2px solid #b9b9ff' }}
        onClick={e => { e.stopPropagation(); if (user) setDropdownOpen(open => !open); }}
        title="Profile"
        tabIndex={0}
        role="button"
        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && user) setDropdownOpen(open => !open); }}
      >
        <Avatar
          src={user && user.profileImg ? `data:image/jpeg;base64,${user.profileImg}` : defaultProfilePic}
          sx={{ width: 40, height: 40, bgcolor: '#8f5cff' }}
        >
          {!user?.profileImg && user?.username ? user.username[0].toUpperCase() : null}
        </Avatar>
      </span>
      {user && dropdownOpen && (
        <div
          className="user-profile-dropdown"
          style={{
            position: 'absolute',
            right: 0,
            top: 48,
            background: 'var(--card-bg-clr)',
            color: 'var(--para-clr)',
            border: '1px solid var(--hr_line_card)',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            minWidth: 120,
            zIndex: 3000,
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <button
            className="dropdown-item"
            style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--para-clr)' }}
            onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
          >
            Profile
          </button>
          {user && user.role === 'SELLER' && (
            <button
              className="dropdown-item"
              style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--para-clr)' }}
              onClick={() => { setDropdownOpen(false); navigate('/myproducts'); }}
            >
              My Products
            </button>
          )}
          {user && user.role === 'BUYER' && (
            <button
              className="dropdown-item"
              style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--para-clr)' }}
              onClick={() => { setDropdownOpen(false); navigate('/myorders'); }}
            >
              My Orders
            </button>
          )}
          <button
            className="dropdown-item"
            style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--para-clr)' }}
            onClick={() => { setDropdownOpen(false); localStorage.clear(); setUser(null); navigate('/login'); }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default NavbarUserProfileButton;
