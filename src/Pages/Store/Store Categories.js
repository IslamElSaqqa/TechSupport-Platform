import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from 'react-router-dom';
import { useScraper } from "../../context/ScrapingContext/ScraperContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const StoreCategories = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productName = queryParams.get("productName");

    const { scrapedData, setScrapedData } = useScraper();
    const [inputProduct, setInputProduct] = useState(productName || '');
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            if (!productName) {
                setError("Please Enter Product Name");
                return;
            }

            try {
               //  Only fetch if scrapedData is empty or undefined
            if (!scrapedData || Object.keys(scrapedData).length === 0) {
            const response = await axios.get(`http://localhost:4000/api/scraping/scrapeAll?productName=${productName}`);
                setScrapedData(response.data);

            }
        } catch (err) {
                setError("Failed to fetch products");
                setLoading(false);
                console.error(err);
            }
        };

            if(!scrapedData)
                fetchProducts();
        
    }, [productName, scrapedData, setScrapedData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);


        try {
            const response = await axios.get(`http://localhost:4000/api/scraping/scrapeAll?productName=${inputProduct}`);
            setScrapedData(response.data);
        } catch (err) {
            setError("Error fetching New Data!");
        }
        navigate(`?productName=${inputProduct}`);
        setLoading(false);
        

    };

    const scrollContainer = React.useRef(null);

    const scrollLeft = () => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    return (
        <div className="content-container">
            <div className="search-container-error">
                <h1 className="DIVO-logo-error">
                    <span className="orange-text">D</span>IVO{" "}
                    <span className="orange-text">STORE</span>
                </h1>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="search-box-container-error">
                        <div className="search-input-error">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={inputProduct}
                                onChange={(e) => setInputProduct(e.target.value)}
                            />
                        </div>
                        <button disabled={loading} className="search-button">
                            {loading ? "Searching..." : "SEARCH"}
                        </button>
                    </div>
                </form>
                { /* Adding Loading Spinner */}
                {loading && (
                        <div className="spinner-container">
                            <div className="spinner"></div>
                        </div>
                    )}
                <span className="Store-welcome-span">"Find The Best Prices For Your Product"</span>

                {['amazon', 'jumia', 'cairoSales', 'shikoStore', 'maxHardware'].map((store) => (
                    <div key={store} className="browse-category-container">
                        <div className="flash-sales-container">
                            <div className="header-section">
                                <div className="cpu-indicator">
                                    <div className="cpu-bar"></div>
                                    <span>
                                        {store.charAt(0).toUpperCase() + store.slice(1)} - "{productName}"
                                    </span>
                                </div>
                                <div className="sales-header">
                                    <h1 className="sales-title"></h1>
                                    <div className="navigation-controls">
                                        <button className="nav-button" onClick={scrollLeft}>
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button className="nav-button" onClick={scrollRight}>
                                            <ChevronRight size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="products-scroll-container">
                                <div className="products-container" ref={scrollContainer}>
                                    {scrapedData[store] && Array.isArray(scrapedData[store].products) && scrapedData[store].products.length > 0 ? (
                                        scrapedData[store].products.map((product) => (
                                            <div key={product.link} className="product-card">
                                                <div className="product-image-container">
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.title}
                                                        className="product-image"
                                                    />
                                                    <button
                                                        onClick={() => window.open(product.link, "_blank", "noopener,noreferrer")}
                                                        className="add-to-cart-btn"
                                                    >
                                                        Navigate
                                                    </button>
                                                </div>
                                                <div className="product-info">
                                                    <h3 className="product-title">{product.title}</h3>
                                                    <div className="product-price">
                                                        <span className="current-price">{product.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No products found for this store</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoreCategories;



