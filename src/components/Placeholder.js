import "./Placeholder.css";
import loginImg from "../images/login-96.png";
import loadingImg from "../images/loading-100.png"

export default function Placeholder({ type, text }) {
    return (
        <div className="placeholder">
            <img 
                src={(type === "login"? loginImg : loadingImg)} 
                alt="login"
                className={(type === "login"? "ph-img" : "rotate")} 
            />
            <p className="ph-text">{text}</p>
        </div>
    )
}