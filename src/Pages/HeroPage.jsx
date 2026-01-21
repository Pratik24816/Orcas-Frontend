import Navigation from '../Componetns/Navigation'
import { useNavigate } from 'react-router-dom'
import "../Pages-Css/HeroPage.css"


function HeroPage() {

  const navigate = useNavigate();
const handleCreateWorkspace  = ()=>{
    navigate("/create-workspace")
}

  return (
    <div>
        <Navigation />
        <div className='hero-container'>
            <h1>Manage Projects at the <br /> 
            <span className="highlight">Speed of Thought.</span></h1>
            
            <p>The all-in-one workspace designed for agile teams. Streamline workflows, automate reporting, and ship faster—without the chaos.</p>
            
            <div className="hero-buttons">
                <button className="btn-primary" onClick={handleCreateWorkspace}>Get Started for Free</button>
            </div>

        </div>
    </div>
  )
}

export default HeroPage