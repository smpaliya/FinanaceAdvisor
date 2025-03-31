import React from 'react';
import './Navbar.css';
import { Link  } from 'react-router-dom';
function Navbar(){
    return(
        <>
        <div className='Navbar'>
            <div className='Nvoptions'>
                <Link to='/' className='Nvoption'>Home</Link>
                <Link to='/smartBudget' className='Nvoption'>SmartBudget</Link>
                <Link to='/investmentAdvisor' className='Nvoption'>InvestmentAdvisor</Link>
                <div className='Nvoption'>SmartTools</div>
                <Link to='/logout' className='Nvoption'>LogOut</Link>
            </div>
            </div></>
    )
}
export default Navbar;