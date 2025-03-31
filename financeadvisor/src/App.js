import logo from './logo.svg';
import './App.css';
import { useEffect,useState } from 'react';
import Navbar from './NavBar/Navbar'; 
import SmartBudget from './SmartBudget/SmartBudget';
import SignUpForm from './LogInSignUp/SignUpForm';
import LogInForm from './LogInSignUp/LogInForm';
import Home from './Home/Home';
import NewsReader from './NewsReader/NewsReader';
import LogOut from './LogInSignUp/LogOut';
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
function App() {
  const APP_PREFIX = "financeApp_";
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('${APP_PREFIX}token'));
  console.log("Username",localStorage.getItem('${APP_PREFIX}username'))
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <>
    <BrowserRouter>
    {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated}/>}
    <Routes>
      <Route path='/' element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />}></Route>
      <Route path="/home" element={<PrivateRoute><Home/></PrivateRoute>}/>
      <Route path='/smartBudget' element={<PrivateRoute><SmartBudget></SmartBudget></PrivateRoute>}></Route>
      <Route path='/signin' element={<SignUpForm></SignUpForm>}></Route>
      <Route path='/logout' element={<PrivateRoute><LogOut setIsAuthenticated={setIsAuthenticated} ></LogOut></PrivateRoute>}></Route>
      <Route path='/investmentAdvisor' element={<PrivateRoute><NewsReader></NewsReader></PrivateRoute>}></Route>
      <Route path='/login' element={isAuthenticated ? <Navigate to="/home" /> : <LogInForm setIsAuthenticated={setIsAuthenticated} ></LogInForm>}></Route>
      </Routes>
    </BrowserRouter>
      </>
  );
}

export default App;
