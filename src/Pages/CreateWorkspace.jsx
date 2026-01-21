import Navigation from "../Componetns/Navigation";
import "../Pages-Css/CreateWorkspace.css"
import { SiWorkplace} from "react-icons/si"
import { IoPerson } from "react-icons/io5";
import { MdOutlineCreateNewFolder } from "react-icons/md";
const CreateWorkspace = () => {
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
                    <form>
                        <div className="label">YOUR NAME</div>
                        <div className="input-group">
                           <IoPerson />
                            <input type="text" placeholder="e.g. Alex Smith" />
                        </div>

                        <br />
                        <br />

                        <div className="label">WORKSPACE NAME</div>
                        <div className="input-group">
                            <SiWorkplace />
                            <input type="text" placeholder="e.g. Alex Smith" />
                        </div>

                        <div className="helper">! This will be the name of your team on QuickTask.</div>
                    </form>
                </div>

                <div className="workspace-buttons">
                    <button className="btn-primary">Create Workspace</button>
                </div>

            </div>
        </div>
    )
}   

export default CreateWorkspace;
