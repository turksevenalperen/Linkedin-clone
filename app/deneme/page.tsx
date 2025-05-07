"use client"
import { useState } from "react";

function counter () {
 const [count,SetCount] = useState(0);
 
 
 return(
    <div>
        <h2>sayaç :{count}</h2>
        <button onClick={()=> SetCount(count+1)}> artır</button>
    </div>
 )
}
