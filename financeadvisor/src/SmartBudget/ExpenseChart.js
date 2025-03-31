import React,{useEffect,useState,useRef} from "react";
import Chart from "chart.js/auto";
const ExpenseChart = () => {
const [data,setData]=useState([]);
const ChartReff=useRef(null);
const chartInstance = useRef(null); 
const APP_PREFIX="financeApp_";
const token = localStorage.getItem(`${APP_PREFIX}token`);
useEffect(()=>{
    const fetchData=async()=>{
        console.log("Token in chart page:",token);
        try{
            const response=await fetch("http://localhost:8000/api/dailyExpense/",{
              method:'GET',
              headers:{
              'Authorization': `Token ${token}`, 
            },});
            if (response.ok) {
              const jsonData = await response.json();
              console.log("API Response:", jsonData); // Log entire response
              setData(jsonData.results || jsonData.data || jsonData || []); // Check possible structures
          } else {
              console.error("Error fetching data:", response.statusText);
          }
      } catch (error) {
          console.error("Error while fetching:", error);
      }
  };
  fetchData();
}, []);
useEffect(() => {
    if (data.length === 0) return; // Don't render if data is empty

    // Destroy old chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const newChart = new Chart(ChartReff.current, {
        type: "bar",
        data: {
          labels: data.map((row) => row.date|| ""), // X-axis labels
          datasets: [
            {
              label: "Expenditure Every Day",
              data: data.map((row) => row.total|| 0), // Y-axis values
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.2)",
              tension: 0.2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: "Date" },
            },
            y: {
              title: { display: true, text: "Amount Spent" },
            },
          },
        },
      });
      chartInstance.current = newChart; // Save chart instance
      return () => {
        newChart.destroy(); // Cleanup when component unmounts
      };
    }, [data]); 
    return(
        <div style={{width:"80%",height:"400px"}}>
        <canvas ref={ChartReff}></canvas>
        </div>
    )

};
export default ExpenseChart;