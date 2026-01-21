import React from 'react'
import "../Components-Css/Navigation.css"

function Navigation() {
  return (
    <div className='nav-container'>

        <div className="nav-logo">
          <h2>Orcas</h2>
        </div>

        <div className="nav-page">
          <ul>
            <li>Features</li>
            <li>Solutions</li>
            <li>Price</li>
            <li>Help</li>
          </ul>
        </div>

        <div className="nav-startbtn">
          <button onClick={()=>alert("Get Started")}>Get Started</button>
        </div>

    </div>

    
  )
}

export default Navigation