import React, { useEffect, useState } from 'react'

const index = () => {
    const [courses, setCourses] = useState([])
    useEffect(() => { 
        async function getAll() {
          try {
            const res = await fetch("http://localhost:5000/courses", {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
      
            if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
      
            const result = await res.json();
            console.log(result);
            setCourses(result);
          } catch (error) {
            console.error("Fetch error:", error);
          }
        }
      
        getAll();
      }, []);
      
  return (
    <div>

    </div>
  )
}

export default index