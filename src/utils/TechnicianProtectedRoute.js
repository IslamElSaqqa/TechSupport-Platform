// TechnicianProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useTechnicianContext } from "../Hooks/Technician/useTechnicianContext";

const TechnicianProtectedRoute = ({ children }) => {
    const { technician } = useTechnicianContext();

    if (!technician?.token) {
        return <Navigate to="/technician-login" replace />;
    }

    return children;
};

export default TechnicianProtectedRoute;
