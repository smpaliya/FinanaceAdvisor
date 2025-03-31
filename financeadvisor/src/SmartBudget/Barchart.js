import Chart from 'chart.js/auto'
import { useEffect, useState } from 'react';

(async function() {
    const [data,setData]=useState({});
    const fetch=()=>{
        useEffect=(()=>{
            fetch('https://jsonplaceholder.typicode.com/photos')
      .then((res) => {
        setData(res.json());
      })
        });
    }
  const data1 = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  new Chart(
    document.getElementById('Barchart'),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'expendature every day',
            data: data.map(row => row.count)
          }
        ]
      }
    }
  );
})();
