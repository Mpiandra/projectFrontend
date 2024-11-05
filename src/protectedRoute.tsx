import {JSX} from "react";
import {useNavigate} from "react-router-dom";

interface ProtectedRouteProps {
    children : JSX.Element;
}

const ProtectedRoute : React.FC<ProtectedRouteProps> = ( { children }) => {
    const navigate = useNavigate()
    const isAuthenticated = localStorage.getItem("token") !== null;
    if(!isAuthenticated) {
        navigate("/login");
    }
    return children;
}

export default ProtectedRoute;