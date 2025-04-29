import React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

const HomeStores = () => {
  const scrollContainer = React.useRef(null);
  const Stars_count = (rating) => Math.round(rating);
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

  const stores = [
    {
      id: 1,
      title: "Cpu Intel Core I5-13400 (4.60Ghz/20Mb) (Lga1700)",
      image: "/api/placeholder/400/320",
      location: "Sidi Beshr Alexandria",
      link: "https://support.microsoft.com/en-us/windows",
      rating: 5,
    },
    {
      id: 2,
      title: "Cpu Intel Core I5-12400F (4.40Ghz/18Mb) (Lga1700)",
      image: "/api/placeholder/400/320",
      location: "Mandaraaaaa Alex",
      rating: 2,
    },
    {
      id: 3,
      title: "Cpu Intel Core I5-13400F (4.60Ghz/20Mb) (Lga1700)",
      image: "/api/placeholder/400/320",
      location: "Store 1",

      rating: 5,
    },
    {
      id: 4,
      title: "Cpu Intel Core I5-11400F (2.60Ghz/12Mb) (Lga1200)",
      image: "/api/placeholder/400/320",
      location: "Store 1",

      rating: 4.5,
    },
    {
      id: 5,
      title: "S-Series Cpu",
      image: "/api/placeholder/400/320",
      location: "Store 1",
      rating: 5,
    },
  ];

  return (
    <div className="flash-sales-container-2 ">
      <div className="header-section">
        <div className="cpu-indicator">
          <div className="cpu-bar"></div>
          <span>Best Maintenance Stores</span>
        </div>


        <div className="sales-header">
          <h1 className="sales-title"> </h1>
          <div className="countdown-container">
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
      </div>
      <div className="products-scroll-container">
        <div className="products-container" ref={scrollContainer}>
          {stores.map((store) => (
            <div key={store.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={store.image}
                  alt={store.title}
                  className="product-image"
                />
                <button
                  onClick={() =>
                    window.open(store.link, "_blank", "noopener,noreferrer")
                  }
                  className="add-to-cart-btn"
                >
                  Get Directions <span className="blackspan"> ➤ </span>
                </button>
              </div>
              <div className="product-info">
                <h3 className="product-title">{store.title}</h3>
                <div className="store-location">
                  <div>
                    <div>
                      <span className="location-icon">📍</span>
                      <span className="Location-store-text">
                        {store.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="store-stars">
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
          ))}
        </div>
      </div>

      <div className="view-all-container">
        <button className="view-all-btn">View All Stores</button>
      </div>
    </div>
  );
};

export default HomeStores;
