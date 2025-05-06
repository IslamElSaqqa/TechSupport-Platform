import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/layout";
import Login from "../Pages/AuthenticationPages/login";
import SignUp from "../Pages/AuthenticationPages/signup";
import TroubleLogin from "../Pages/AuthenticationPages/troubleLogin"
import ForgetPass from "../Pages/AuthenticationPages/forgotPassword"; 
import NewPassword from "../Pages/AuthenticationPages/newPassword"
import PassChanged from "../Pages/AuthenticationPages/passChanged"
import MaintenanceStores from "../components/Home_Components/MaintenanceStores/MaintenanceStores";
import Home from "../Pages/Home";
import Header from "../components/header&footer/header";
import Footer from "../components/header&footer/footer";
import WindowsErrors1 from "../components/Windows_Errors/WindowsErrors1";
import WindowsErrors2 from "../components/Windows_Errors/WindowsErrors2";
import RepairShops from "../Pages/RepairShop"
import Community from "../Pages/Community/Community"
import Store from "../Pages/Store/Store";
import StoreCategories from "../Pages/Store/Store Categories";
import OnlineServicing from "../Pages/OnlineServicing/OnlineServicing"
import RequestSuccess from "../Pages/OnlineServicing/RequestSuccess";
import Tech from "../Pages/Techinician/tech"
import ProfilePage from "../Pages/Profile/ProfilePage";
import ContactUs from "../components/header&footer/Footer Links (US)/ContactUs";
import AboutUs from "../components/header&footer/Footer Links (US)/AboutUs";
import WindowsErrors1 from "../components/Windows_Errors/WindowsErrors1";
import WindowsErrors2 from "../components/Windows_Errors/WindowsErrors2";
import RepairShops from "../Pages/RepairShop"
import Community from "../Pages/Community/Community"
import Store from "../Pages/Store/Store";
import StoreCategories from "../Pages/Store/Store Categories";
import OnlineServicing from "../Pages/OnlineServicing/OnlineServicing"
import RequestSuccess from "../Pages/OnlineServicing/RequestSuccess";
import Tech from "../Pages/Techinician/tech"
import ProfilePage from "../Pages/Profile/ProfilePage";
import ContactUs from "../components/header&footer/Footer Links (US)/ContactUs";
import AboutUs from "../components/header&footer/Footer Links (US)/AboutUs";
// Helper for routes with header and footer
const RouteWithHeaderFooter = ({ element }) => (
    <>
        <Header />
        {element}
        <Footer />
    </>
);

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<RouteWithHeaderFooter element={<Layout />} />} />
            <Route path="/login" element={<RouteWithHeaderFooter element={<Login />} />} />
            <Route path="/signup" element={<RouteWithHeaderFooter element={<SignUp />} />} />
            <Route path="/trouble-login" element={<RouteWithHeaderFooter element={<TroubleLogin />} />} />
            <Route path="/ForgetPass" element={<RouteWithHeaderFooter element={<ForgetPass />} />} />
            <Route path="/newPassword" element={<RouteWithHeaderFooter element={<NewPassword />} />} />
            <Route path="/pass-changed" element={<RouteWithHeaderFooter element={<PassChanged />} />} />
            <Route path="/trouble-login" element={<RouteWithHeaderFooter element={<TroubleLogin />} />} />
            <Route path="/ForgetPass" element={<RouteWithHeaderFooter element={<ForgetPass />} />} />
            <Route path="/newPassword" element={<RouteWithHeaderFooter element={<NewPassword />} />} />
            <Route path="/pass-changed" element={<RouteWithHeaderFooter element={<PassChanged />} />} />
            <Route path="/home" element={<RouteWithHeaderFooter element={<Home />} />} />
            <Route path="/maintenance-stores" element={<MaintenanceStores />} />
            <Route path="/windows-errors1" element={<RouteWithHeaderFooter element={<WindowsErrors1 />} />} />
            <Route path="/windows-errors2" element={<RouteWithHeaderFooter element={<WindowsErrors2 />}/>} />
            <Route path="/repair-shops" element={<RouteWithHeaderFooter element={<RepairShops />}/>} />
            <Route path="/Community" element={<RouteWithHeaderFooter element={<Community />}/>} />
            <Route path="/store" element={<RouteWithHeaderFooter element={<Store />}/>} />
            <Route path="/store-categories" element={<RouteWithHeaderFooter element={<StoreCategories  />}/>} />
            <Route path="/online-servicing" element={<RouteWithHeaderFooter element={<OnlineServicing  />}/>} />
            <Route path="/online-servicing/request-success" element={<RouteWithHeaderFooter element={<RequestSuccess />}/>}/>
            <Route path="/it-interface" element={<RouteWithHeaderFooter element={<Tech />}/>}/> 
            <Route path="/profile-page" element={<RouteWithHeaderFooter element={<ProfilePage />}/>}/> 
            <Route path="/contact-us" element={<RouteWithHeaderFooter element={<ContactUs/>}/>}/> 
            <Route path="/about-us" element={<RouteWithHeaderFooter element={<AboutUs/>}/>}/> 

            <Route path="/windows-errors1" element={<RouteWithHeaderFooter element={<WindowsErrors1 />} />} />
            <Route path="/windows-errors2" element={<RouteWithHeaderFooter element={<WindowsErrors2 />}/>} />
            <Route path="/repair-shops" element={<RouteWithHeaderFooter element={<RepairShops />}/>} />
            <Route path="/Community" element={<RouteWithHeaderFooter element={<Community />}/>} />
            <Route path="/store" element={<RouteWithHeaderFooter element={<Store />}/>} />
            <Route path="/store-categories" element={<RouteWithHeaderFooter element={<StoreCategories  />}/>} />
            <Route path="/online-servicing" element={<RouteWithHeaderFooter element={<OnlineServicing  />}/>} />
            <Route path="/online-servicing/request-success" element={<RouteWithHeaderFooter element={<RequestSuccess />}/>}/>
            <Route path="/it-interface" element={<RouteWithHeaderFooter element={<Tech />}/>}/> 
            <Route path="/profile-page" element={<RouteWithHeaderFooter element={<ProfilePage />}/>}/> 
            <Route path="/contact-us" element={<RouteWithHeaderFooter element={<ContactUs/>}/>}/> 
            <Route path="/about-us" element={<RouteWithHeaderFooter element={<AboutUs/>}/>}/> 

        </Routes>
    );
};

export default AppRoutes;
