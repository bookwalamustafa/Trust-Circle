import React, { useState } from 'react';
import Header from '../components/Header';
import '../css/LoginSignup.css';

const MANUAL_AUTH_MODE = false;

const TEST_USERS = {
  'mustafa.bookwala@sap.com': { password: 'iammustafa', userID: 1 },
  'adyan.chowdhury@sap.com': { password: 'iamadyan', userID: 2 },
  'lucas.loepke@sap.com': { password: 'iamlucas', userID: 3 },
  'nyle.coleman@sap.com': { password: 'iamnyle', userID: 4 } 
};

const LoginSignup = ({ mode = 'login' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    ssn: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Manual authentication mode for local testing
    if (MANUAL_AUTH_MODE) {
      if (mode === 'login') {
        const user = TEST_USERS[formData.email];
        if (user && user.password === formData.password) {
          localStorage.setItem('userId', user.userID);
          localStorage.setItem('userEmail', formData.email);
          const redirectPath = formData.email === 'mustafa.bookwala@sap.com' ? '/creategroup' : '/group';
          window.location.href = redirectPath;
          return;
        } else {
          alert('Invalid email or password. Please try again.');
          return;
        }
      } else {
        // For signup in manual mode, just create a new test user
        if (TEST_USERS[formData.email]) {
          if (formData.email !== 'mustafa.bookwala@sap.com') {
            alert('An account with this email already exists. Please log in instead.');
            return;
          }
        }
        
        // Add new user to test users (this is just for demo)
        const newUserID = Object.keys(TEST_USERS).length + 1;
        TEST_USERS[formData.email] = { 
          password: formData.password, 
          userID: newUserID 
        };
        
        localStorage.setItem('userId', newUserID);
        localStorage.setItem('userEmail', formData.email);
        alert('Account created successfully! Welcome to Trust Circle. Redirecting to your group...');
        window.location.href = '/login';
        return;
      }
    }

    // Original database authentication code
    // const BASE_URL = 'https://trust-circle.cfapps.us10-001.hana.ondemand.com';
    // const url = mode === 'login' ? `${BASE_URL}/login` : `${BASE_URL}/signup`;

    const payload = mode === 'login'
      ? { email: formData.email, password: formData.password }
      : {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob: formData.dob,
          email: formData.email,
          phone: formData.phone,
          ssn: formData.ssn,
          password: formData.password
        };

    try {
      const response = await fetch(`/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON, got:', text);
        alert('Server returned unexpected response. Check console for details.');
        return;
      }

      const result = await response.json();

      if (response.ok) {
        if (mode === 'login') {
          localStorage.setItem('userId', result.userID);
          localStorage.setItem('userEmail', formData.email);
          const redirectPath = formData.email === 'mustafa.bookwala@sаp.com' ? '/creategroup' : '/group';
          window.location.href = redirectPath;
        } else {
          // For signup, the user ID is now returned directly from the signup endpoint
          localStorage.setItem('userId', result.userID);
          localStorage.setItem('userEmail', formData.email);
          alert('Account created successfully! Welcome to Trust Circle. Redirecting to your group...');
          window.location.href = '/creategroup';
        }
      } else {
        if (mode === 'login') {
          alert(result.message || 'Invalid email or password. Please try again.');
        } else {
          if (response.status === 409) {
            alert('An account with this email already exists. Please log in instead.');
          } else {
            alert(result.message || 'Signup failed. Please check your information and try again.');
          }
        }
      }
    } catch (err) {
      console.error('Fetch failed:', err);
      alert('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div>
      <Header showButtons={false} />
      <div className="form-container">
        <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <input id="firstName" type="text" placeholder="First Name" required onChange={handleChange} />
              <input id="lastName" type="text" placeholder="Last Name" required onChange={handleChange} />
              <input id="email" type="text" placeholder="Email" required onChange={handleChange} />
              <input id="phone" type="tel" placeholder="Phone" required onChange={handleChange} />
              <input id="dob" type="text" placeholder="Date of Birth (MM/DD/YYYY)" required onChange={handleChange} />
              <input id="ssn" type="text" placeholder="SSN" required onChange={handleChange} />
              <input id="password" type="password" placeholder="Password" required minLength={6} onChange={handleChange} />
            </>
          )}
          {mode === 'login' && (
            <>
              <input id="email" type="email" placeholder="Email" required onChange={handleChange} />
              <input id="password" type="password" placeholder="Password" required minLength={6} onChange={handleChange} />
            </>
          )}
          <button type="submit">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
        </form>
        <div className="switch-link">
          {mode === 'login' ? (
            <>Don't have an account? <a href="/signup">Sign Up</a></>
          ) : (
            <>Already have an account? <a href="/login">Login</a></>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
