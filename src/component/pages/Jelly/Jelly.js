import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';

function Jelly() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://127.0.0.1:5005/')
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Failed to fetch data');
        }
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-5">
        <div className ="font-bold text-3xl">
        Jelly
        </div>
        { data ? <Dashboard/> : <>Please start FastAPI</>}
    </div>
  );
}

export default Jelly;