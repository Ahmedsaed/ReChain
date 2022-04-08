import "./Placeholder.css";
import loginImg from "../images/login-96.png";

export default function Placeholder({ type, text }) {
    return (
        <div className="placeholder">
            <img src={loginImg} alt="login" className="ph-img" />
            <p className="ph-text">{text}</p>
        </div>
    )
}