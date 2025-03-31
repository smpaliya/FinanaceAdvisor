import React, { useState } from 'react';
import axios from 'axios';
import './SmartBudget.css'
import CategoricalSpending from './CategoricalSpending';
import ExpenseChart from './ExpenseChart';
function SmartBudget(){
    const [product,setProduct]=useState('');
    const [moneySpent,setMoneySpent]=useState(0);
    const [category,setCategory]=useState('');
    const [date,setDate]=useState(null);
    const[user,setUser]=useState('');
    const [error, setError] = useState('');
    const[loadExpenseChart,setloadExpenseChart]=useState(false);
    const[loadCategoricalChart,setloadCategooricalChart]=useState(false);
    const APP_PREFIX = "financeApp_";
    const token = localStorage.getItem(`${APP_PREFIX}token`);
    console.log("token",token);
   
    const handleSubmit=async(event) =>{
       
        event.preventDefault();//imp to prevent default submit
        const username = localStorage.getItem(`${APP_PREFIX}username`); // Correct usage
        setUser(username); 
        if (!username) {
            alert('User not logged in!');
            return;
          }
        setError('');
        const user_id=localStorage.getItem(`${APP_PREFIX}user_id`);
        console.log("user_id",user_id);
        const expenseData ={
          "user":user_id,
          "product": product,
          "moneySpent": parseFloat(moneySpent).toFixed(3),
          "category": category,
          "date": date,
        }
        console.log(expenseData);
        try {
          const response = await fetch('http://localhost:8000/api/smartBudget/', {
              method: 'POST', 
              headers: {
                'Authorization': `Token ${token}`, 
                  'Content-Type': 'application/json',
                 
              },
              body: JSON.stringify(expenseData),
          });
  
          const data = await response.json(); // Get response data
        if(response.ok){
            alert("bill added");
        }
          if (!response.ok) {
             console.log(data.error);
              throw new Error(data.error || 'Failed to add expense');
          }
  
      } catch (error) {
          console.error('Error:', error.message);
      }
    };
  
    const handleLoadExpenseChart= () =>{
        setloadExpenseChart(true);
    }
    const handleLoadCategoricalSpending=()=>{
        setloadCategooricalChart(true);
    }
    return(
        <>
        <div className='ExpenseCounterDiv'>
        <h1>SmartBudget</h1>
        <form className='ExpenseCounter' onSubmit={handleSubmit}>
        <label className='l1'>Brand/Shop/Restaurant name</label>
        <input type='text' placeholder=''className='ECinput' onChange={e=>setProduct(e.target.value)}></input>
        <br></br>
        <label className='l1'>Money Spent</label>
        <input type='number' placeholder='' className='ECinput' onChange={e=>setMoneySpent(e.target.value)}></input>
        <br></br>
        <label className='l1'>Category</label>
        <select name='category' className='ECinput' onChange={e=>setCategory(e.target.value)}>
            <option value='Transport'>Transport</option>
            <option value='Restaurant'>Restaurant</option>
            <option value='Cafe'>Cafe</option>
            <option value='Tution'>Tution</option>
            <option value='Groceries'>Groceries</option>
            <option value='Movie'>Movie</option>
            <option value='Gift'>Gift</option>
            <option value='Clothing'>Clothing</option>
            <option value='Traveling'>Traveling</option>
            <option value='Books'>Books</option>
            <option value='School Fees'>School Fees</option>
            <option value='Shoping'>Shoping</option>
            <option value='Education'>Education</option>
            <option value='fuel'>Fuel</option>
            <option value='Electricity'>Electricity</option>
            <option value='Rent'>Rent</option>
            <option value='Green Grocery'>'Green Grocery</option>
            <option value='other'>Other</option>
        </select>
        <br></br>
        <label className='l1'>Date</label>
        <input type='date' className='ECinput' onChange={e=>setDate(e.target.value)}></input>
        <br></br>
        <button type='submit' className='button-57'>Submit</button>
        </form>
        </div>
        <div className='dsahboardSection'>
            <button className='expensechart' onClick={handleLoadExpenseChart}>Expense Chart</button>
            <button className='categorychart' onClick={handleLoadCategoricalSpending}>See Categorical Spending</button>
            {loadCategoricalChart && <CategoricalSpending></CategoricalSpending> }
            {loadExpenseChart && <ExpenseChart></ExpenseChart>}

        </div>
        </>
    )
}
export default SmartBudget;