import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/App.css';
 
const GroupsHeader = ({ firstName, lastName }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
 
  const getInitials = (first, last) => {
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
  };
 
  const handleLogOut = () => {
    localStorage.removeItem('userEmail'); // clear user email
    navigate('/'); // redirect to login or home
  };  
 
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
 
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Left: Logo + Title */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        <img src="../images/white_logo.png" alt="Logo" className="header-logo" />
        <h1 style={{ margin: 0 }}>Trust Circle</h1>
      </div>
 
      {/* Right: Profile Circle and Dropdown */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <div
          className="member-node"
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            width: '50px',
            height: '50px',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#0077b6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            userSelect: 'none',
          }}
        >
          {getInitials(firstName, lastName)}
        </div>
 
        {showDropdown && (
          <div
            style={{
              position: 'absolute',
              top: '60px',
              right: 0,
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 10,
              overflow: 'hidden',
              minWidth: '150px',
            }}
          >
            {['Profile', 'Credit Score', 'Settings'].map((item) => (
              <div
                key={item}
                style={{
                  padding: '10px 15px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  color: '#333',
                }}
                onClick={() => setShowDropdown(false)}
                onMouseEnter={(e) => (e.target.style.background = '#f0f0f0')}
                onMouseLeave={(e) => (e.target.style.background = 'white')}
              >
                {item}
              </div>
            ))}
            <div
              style={{
                padding: '10px 15px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                color: '#d90429',
                borderTop: '1px solid #eee',
              }}
              onClick={handleLogOut}
              onMouseEnter={(e) => (e.target.style.background = '#fef2f2')}
              onMouseLeave={(e) => (e.target.style.background = 'white')}
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
 
export default GroupsHeader;