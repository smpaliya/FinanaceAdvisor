import React, { useState } from 'react';

import axios from 'axios';
import './SignUp.css'
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
 
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    // Clear previous error messages
    setError('');
    setSuccessMessage('');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    
    

    axios.post('http://localhost:8000/api/signup/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        setSuccessMessage('User registered successfully!');
        navigate("/login");
      })
      .catch(error => {
        setError(error.response.data.error || 'An error occurred during registration.');
      });
  };

  return (
    <div className='SignUp' >
      <div className='companyTitle'>
        <h1 className='TitleName1'>Finance</h1><h1 className='TitleName2'>Advisor</h1>
      </div>
      <h1 className='SignUpTitle'>Signup</h1>
      <div className='Signupcontainers'>
        <div className='SignUpContainer'>
    <form onSubmit={handleSubmit} className="signup-form">
      <br></br>
      <label 
      className='FullnameLabel'>
        Username
      </label>
      <br></br>
      <input
        type="text"
        placeholder="Username"
        className='inputSignup'
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <br></br>
      <label 
      className='EmailLabel'>
        Email
      </label>
      <br></br>
      <input
        type="email"
        placeholder="Email"
        className='inputSignup'
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <br></br>
      <label 
      className='passwordLabel'>
        Password
      </label>
      <br></br>
      <input
        type="password"
        placeholder="Password"
        className='inputSignup'
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <br></br>
      <button className='SignUpSubmit' type="submit">Sign Up</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </form>
    </div>
    <div className='designContainer'></div>
    </div>
    
    </div>
  );
};

export default SignUpForm;
