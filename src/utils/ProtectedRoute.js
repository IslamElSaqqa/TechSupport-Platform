import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Hooks/useAuthContext";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, requiredAdmin = false }) => {
    const { user } = useAuthContext();

    if (!user?.token) {
        // No token: redirect to login
        return <Navigate to="/login" replace />;
    }

    try {
        if (user.token.split('.').length !== 3) {
        throw new Error("Invalid token format");
        }

        const base64Url = user.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(window.atob(base64));
        const userPresence = decodedPayload.user_presence;

        // If admin required and userPresence !== 1
        if (requiredAdmin && userPresence !== 1) {
            toast.warn("Admin access required");
            return <Navigate to="/home" replace />;
            }

        // All good, render protected children
        return children;
    } catch (err) {
        console.error("Token decoding failed:", err);
        sessionStorage.removeItem("user"); 
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
