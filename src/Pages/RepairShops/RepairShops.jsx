import React from "react";

const RepairShops = () => {
  const storeData = [
    {
      name: "Kimo Store",
      area: "Sidi Beshr",
      gov: "Alexandria",
      rating: "5.0",
      url: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8",
    },
    {
      name: "Desktop Store",
      area: "Sidi Beshr",
      gov: "Alexandria",
      rating: "4.6",
      url: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8",
    },
    {
      name: "Switch Plus Store",
      area: "Sidi Beshr",
      gov: "Alexandria",
      rating: "5.0",
      url: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8",
    },
    {
      name: "Professional Store",
      area: "Sidi Beshr",
      gov: "Alexandria",
      rating: "5.0",
      url: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8",
    },
    {
      name: "Paragon Laptop Store",
      area: "Sidi Beshr",
      gov: "Alexandria",
      rating: "4.3",
      url: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8",
    },
    {
      name: "Al Batool Store",
      area: "Sidi Beshr",
      gov: "Alexandria",
      rating: "3.8",
      url: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8",
    },
  ];
  const Stars_count = (rating) => {
    return Math.round(rating);
  };
  return (
    <div className="content-container">
      <div className="repair-shops-container">
        <div className="search-section-repair-shops">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter area name"
              className="search-input-shops"
            />
            <a href=" ">
              <img
                src="https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/componen.png"
                alt="Search"
                className="search-icon"
              />
            </a>
          </div>
          <button className="search-button-repair-shops">
            Get your nearest store without search
          </button>
        </div>

        <h2 className="section-title-repair-shops">Best Maintenance Stores</h2>

        <div className="stores-list">
          {storeData.map((store, index) => (
            <div key={index} className="store-item">
              <div className="store-icon-wrapper">
                <img
                  src={
                    "https://dashboard.codeparrot.ai/api/image/Z9S4MJIdzXb5OlMf/store-re-6.png"
                  }
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
                  <p className="store-location">
                    {store.area}, {store.gov}
                  </p>
                </div>
                <div className="store-rating">
                  <span className="rating-value">{store.rating}</span>
                  <div className="rating-stars">
                    {[...Array(Stars_count(store.rating))].map((_, i) => (
                      <img
                        key={i}
                        src={
                          "https://dashboard.codeparrot.ai/api/image/Z9S4MJIdzXb5OlMf/star-sol-6.png"
                        }
                        alt="Star"
                        className="star-icon"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="navigate-wrapper">
                <a href={store.url} target="_blank" rel="noopener noreferrer">
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
