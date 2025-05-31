import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Hooks/useAuthContext";
import { toast } from "react-toastify";


const UserProtectedRoute = ({ children, requiredPresence = null }) => {
    const { user } = useAuthContext();

    // If user is not logged in
    if (!user || !user.token) {
        return <Navigate to="/login" replace />;
    }

    try {
        // Decode JWT token to extract user_presence
        const base64Url = user.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(window.atob(base64));
        const userPresence = decodedPayload.user_presence;

        // If a specific role is required and doesn't match
        if (requiredPresence !== null && userPresence !== requiredPresence) {
            toast.warn("Access denied.");
            return <Navigate to="/home" replace />;
        }

        return children;
    } catch (err) {
        console.error("Token decoding failed:", err);
        sessionStorage.removeItem("user");
        toast.error("Session expired. Please log in again.");
        return <Navigate to="/login" replace />;
    }
};

export default UserProtectedRoute;
