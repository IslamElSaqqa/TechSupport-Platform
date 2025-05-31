import { Routes, Route } from "react-router-dom";

// Public Pages & Components
import Layout from "../components/Layout/layout";
import Login from "../Pages/AuthenticationPages/login";
import SignUp from "../Pages/AuthenticationPages/signup";
import TroubleLogin from "../Pages/AuthenticationPages/troubleLogin";
import ForgetPass from "../Pages/AuthenticationPages/forgotPassword";
import NewPassword from "../Pages/AuthenticationPages/newPassword";
import PassChanged from "../Pages/AuthenticationPages/passChanged";
import Home from "../Pages/Home";
import WindowsErrors1 from "../components/Windows_Errors/WindowsErrors1";
import WindowsErrors2 from "../components/Windows_Errors/WindowsErrors2";
import RepairShops from "../Pages/RepairShop";
import Community from "../Pages/Community/Community";
import Store from "../Pages/Store/Store";
import StoreCategories from "../Pages/Store/Store Categories";
import OnlineServicing from "../Pages/OnlineServicing/OnlineServicing";
import RequestSuccess from "../Pages/OnlineServicing/RequestSuccess";
import ContactUs from "../components/header&footer/Footer Links/ContactUs";
import PrivacyPolicy from "../components/header&footer/Footer Links/PrivacyPolicy";
import AboutUs from "../Pages/About Us/AboutUs";
import TechnicianLogin from "../Pages/AuthenticationPages/Technician/TechnicianLogin";
import Error404 from "../Pages/Error404";

// Header & Footer
import Header from "../components/header&footer/header";
import Footer from "../components/header&footer/footer";

// Protected Pages
import ProfilePage from "../Pages/Profile/ProfilePage";
import Technician from "../Pages/Technician/Technician";

// Admin Dashboard Pages
import ServicesRequests from "../components/AdminDashboard/ServiceRequests/ServicesRequests";
import Accounting from "../components/AdminDashboard/Accounting/Accounting";
import Users from "../components/AdminDashboard/Users/Users";
import AdminRepairShops from "../components/AdminDashboard/RepairShops/RepairShops";
import WinErrors from "../components/AdminDashboard/WinErrors/WinErrors";
import DashboardLayout from "../components/AdminDashboard/DashBoard/DashboardLayout";

// Misc
import MaintenanceStores from "../components/Home_Components/MaintenanceStores";

// Route Guards
import UserProtectedRoute from "../utils/UserProtectedRoute";
import TechnicianProtectedRoute from "../utils/TechnicianProtectedRoute";

// Wrapper for header/footer
const WithHeaderFooter = ({ children }) => (
    <>
        <Header />
        {children}
        <Footer />
    </>
    );

    const PublicRoute = ({ element }) => <WithHeaderFooter>{element}</WithHeaderFooter>;

    const publicRoutes = [
    { path: "/", element: <Layout /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/trouble-login", element: <TroubleLogin /> },
    { path: "/ForgetPass", element: <ForgetPass /> },
    { path: "/newPassword", element: <NewPassword /> },
    { path: "/pass-changed", element: <PassChanged /> },
    { path: "/home", element: <Home /> },
    { path: "/windows-errors1", element: <WindowsErrors1 /> },
    { path: "/windows-errors2", element: <WindowsErrors2 /> },
    { path: "/repair-shops", element: <RepairShops /> },
    { path: "/Community", element: <Community /> },
    { path: "/store", element: <Store /> },
    { path: "/store-categories", element: <StoreCategories /> },
    { path: "/online-servicing", element: <OnlineServicing /> },
    { path: "/online-servicing/request-success", element: <RequestSuccess /> },
    { path: "/contact-us", element: <ContactUs /> },
    { path: "/privacy-policy", element: <PrivacyPolicy /> },
    { path: "/about-us", element: <AboutUs /> },
    { path: "/technician-login", element: <TechnicianLogin /> },
    ];

    const adminRoutes = [
    { path: "/Dashboard", element: <DashboardLayout /> },
    { path: "/servicing", element: <ServicesRequests /> },
    { path: "/accounting", element: <Accounting /> },
    { path: "/users", element: <Users /> },
    { path: "/admin-repairshops", element: <AdminRepairShops /> },
    { path: "/winerrors", element: <WinErrors /> },
    ];

    const AppRoutes = () => (
    <Routes>
        {/* Public routes with header/footer */}
        {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<PublicRoute element={element} />} />
        ))}

        {/* Special route without wrapper */}
        <Route path="/maintenance-stores" element={<MaintenanceStores />} />

        {/* User protected route (any logged-in user) */}
        <Route
        path="/profile-page"
        element={
            <UserProtectedRoute>
            <WithHeaderFooter>
                <ProfilePage />
            </WithHeaderFooter>
            </UserProtectedRoute>
        }
        />

        <Route
        path="/tech"
                element={<PublicRoute element={<TechnicianProtectedRoute>
                    <Technician />
                </TechnicianProtectedRoute>} />
        }
        />

        {adminRoutes.map(({ path, element }) => (
        <Route
            key={path}
            path={path}
            element={
            <UserProtectedRoute requiredPresence={1}>
                {element}
            </UserProtectedRoute>
            }
        />
        ))}

        <Route path="*" element={<PublicRoute element={<Error404 />} />} />
    </Routes>
);

export default AppRoutes;
