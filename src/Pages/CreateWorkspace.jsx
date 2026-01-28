import Navigation from "../Componetns/Navigation";
import { useState } from "react";
import "../Pages-Css/CreateWorkspace.css"
import{useNavigate} from "react-router-dom"
import {createWorkspace} from "../services/api"
import { SiWorkplace} from "react-icons/si"
import { IoPerson } from "react-icons/io5";
import { MdOutlineCreateNewFolder } from "react-icons/md";
const CreateWorkspace = () => {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
         teamLeadName: '',
         workspaceName: '',
    })
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        setError('');
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

         // Validation
         if (!formData.teamLeadName.trim() || !formData.workspaceName.trim()) {
            setError('Please fill in all fields');
            return;
         }

        setLoading(true);
        try {
              const response = await createWorkspace({
                name: formData.workspaceName,
                teamLeadName: formData.teamLeadName,
              });

              if(response.success){
                navigate(`/team-lead-dashboard/${response.data.workspaceId}`);
              }
        } catch (error) {
          console.error('❌ Error creating workspace:', error);
          setError('Failed to create workspace');
        } finally {
          setLoading(false);
        }
      };

    return (
        <div className="workspace">
            <Navigation /> 

            <div className="workspace-container-card">

                <div className="workspace-head">
                    <div className="logo">
                        <MdOutlineCreateNewFolder />
                    </div>
                    <h2>Set up your workspace</h2>
                </div>
                <div className="workspace-form">
                    <form onSubmit={handleSubmit}>
                        <div className="label">YOUR NAME</div>
                        <div className="input-group">
                           <IoPerson />
                            <input type="text" name="teamLeadName" value={formData.teamLeadName} onChange={handleChange} placeholder="e.g. Alex Smith" />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <br />
                        <br />

                        <div className="label">WORKSPACE NAME</div>
                        <div className="input-group">
                            <SiWorkplace />
                            <input type="text" name="workspaceName" value={formData.workspaceName} onChange={handleChange} placeholder="e.g. Alex Smith" />
                        </div>  
                        {error && <div className="error">{error}</div>}
                        <br />
                        <br />  

                        <div className="helper">! This will be the name of your team on QuickTask.</div>
                    
                        <div className="workspace-buttons" >
                            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Workspace'}</button>
                        </div>
                    </form>

                </div>

                

            </div>
        </div>
    )
}   

export default CreateWorkspace;
