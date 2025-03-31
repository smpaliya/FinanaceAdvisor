import React,{useState} from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import './LogIn.css'
const LogInForm = ({ setIsAuthenticated }) => {
    const APP_PREFIX = "financeApp_";
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (event) => {

      event.preventDefault();
      console.log(username,password);
      axios.post('http://localhost:8000/api_token_auth/', { username, password })
        .then(res => {
          setIsAuthenticated(true)
          localStorage.setItem(`${APP_PREFIX}token`, res.data.token);
          localStorage.setItem(`${APP_PREFIX}username`,username);
          localStorage.setItem(`${APP_PREFIX}user_id`,res.data.user.id);
          navigate('/');
        })
        .catch(error => {
          console.error("Authentication error: ", error);
        }); 
        
    };
  
    return (
      <form onSubmit={handleSubmit} className="login-form">
        <label className='loginlabel'>Username</label>
        <input
          type="text"
          value={username}
          className='logintext'
          onChange={e => setUsername(e.target.value)}
        />
         <label className='loginlabel' >Password</label>
        <input
          type="password"
          value={password}
          className='loginpassword'
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className='loginbutton'>Login</button>
        <p>New to FinanceAdvisor?</p>
        <Link to='/signin'>Sign in</Link>
      </form>
    );
  };
  
  export default LogInForm;