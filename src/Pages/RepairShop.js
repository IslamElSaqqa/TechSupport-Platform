import React, { useState, useEffect } from "react";
import { useRepairShop } from '../Hooks/RepairShop/useRepairShopHook';
import { useRepairShopsContext } from "../Hooks/RepairShop/useRepairShopContext";
const storeData = [
    {
        name: "Kimo Store", area: "Sidi Beshr", gov: "Alexandria",
        rating: "5.0", link: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8"
    },
    {
        name: "Desktop Store", area: "Sidi Beshr", gov: "Alexandria",
        rating: "4.6", link: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8"
    },
    {
        name: "Switch Plus Store", area: "Sidi Beshr", gov: "Alexandria",
        rating: "5.0", link: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8"
    },
    {
        name: "Professional Store", area: "Sidi Beshr", gov: "Alexandria",
        rating: "5.0", link: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8"
    },
    {
        name: "Paragon Laptop Store", area: "Sidi Beshr", gov: "Alexandria",
        rating: "4.3", link: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8"
    },
    {
        name: "Al Batool Store", area: "Sidi Beshr", gov: "Alexandria",
        rating: "3.8", link: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8"
    },
];

const RepairShops = () => {
    const [inputValue, setInputValue] = useState("Alexandria");
    const [displayedStores, setDisplayedStores] = useState(storeData); 
    const { getRepairShops, error, isLoading } = useRepairShop();
    const { repairShops } = useRepairShopsContext();

    // Optional: Auto-search on mount (if needed)
    useEffect(() => {
        const autoSearch = async () => {
            const saved = localStorage.getItem("searchQuery");
            const searchTerm = saved || inputValue;

            if (searchTerm.trim()) {
                const success = await getRepairShops(searchTerm.trim());
                if (success && Array.isArray(repairShops)) {
                    setDisplayedStores(repairShops); // override initial data
                }
            }
        };

        autoSearch();
    }, [inputValue]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const success = await getRepairShops(inputValue.trim());
        if (success && Array.isArray(repairShops)) {
            setDisplayedStores(repairShops); //  override on user search
            localStorage.setItem("searchQuery", inputValue);
        }
    };

    const Stars_count = (rating) => Math.round(rating);

    return (
        <div className="content-container">
            <div className="repair-shops-container">
                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="search-section-repair-shops">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Enter area name or Government"
                                className="search-input-shops"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <img
                                src="https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/componen.png"
                                alt="Search"
                                className="search-icon"
                            />
                        </div>
                        <button disabled={isLoading} className="search-button-repair-shops">
                            {isLoading ? "Loading..." : "Search"}
                        </button>
                    </div>
                </form>

                <h2 className="section-title-repair-shops">Best Maintenance Stores</h2>

                <div className="stores-list">
                    {displayedStores?.map((store, index) => (
                        <div key={index} className="store-item">
                            <div className="store-icon-wrapper">
                                <img
                                    src="https://dashboard.codeparrot.ai/api/image/Z9S4MJIdzXb5OlMf/store-re-6.png"
                                    alt={store.name}
                                    className="store-icon"
                                />
                            </div>
                            <div className="store-details">
                                <h3 className="store-name">{store.name}</h3>
                                <div className="location-wrapper">
                                    <img
                                        src="https://dashboard.codeparrot.ai/api/image/Z9S4MJIdzXb5OlMf/map-soli.png"
                                        alt="Location"
                                        className="location-icon"
                                    />
                                    <p className="store-location">{store.area}, {store.gov}</p>
                                </div>
                                <div className="store-rating">
                                    <span className="rating-value">{store.rating}</span>
                                    <div className="rating-stars">
                                        {[...Array(Stars_count(store.rating))].map((_, i) => (
                                            <img
                                                key={i}
                                                src="https://dashboard.codeparrot.ai/api/image/Z9S4MJIdzXb5OlMf/star-sol-6.png"
                                                alt="Star"
                                                className="star-icon"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="navigate-wrapper">
                                <a href={store.link}>
                                    <img
                                        src="https://dashboard.codeparrot.ai/api/image/Z9S4MJIdzXb5OlMf/right-ar.png"
                                        alt="Navigate"
                                        className="navigate-icon"
                                    />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RepairShops;
