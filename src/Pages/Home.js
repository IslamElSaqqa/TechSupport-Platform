import React from "react";
import Carousel from "../components/Home_Components/Carousel";
import FlashSales from "../components/Home_Components/FlashSales";
import MaintenanceStores from "../components/Home_Components/MaintenanceStores";

function Home() {
    return (
        <div className="App">
            <Carousel />
            <br></br>
            <br></br>
            <FlashSales />
            <MaintenanceStores />
        </div>
);
}
export default Home;