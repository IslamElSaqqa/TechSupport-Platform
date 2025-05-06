import React from "react";
<<<<<<< HEAD

=======
import { NavLink, useNavigate } from "react-router-dom";
>>>>>>> b8178fc5b7074cb92d6162f164c815e106483108
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
<<<<<<< HEAD
      title: "Cpu Intel Core I5-13400 (4.60Ghz/20Mb) (Lga1700)",
      image: "/api/placeholder/400/320",
      location: "Sidi Beshr Alexandria",
      link: "https://support.microsoft.com/en-us/windows",
=======
      title: "Kimo Store",
      image: "https://res.cloudinary.com/dr9yx1tod/image/upload/v1746552229/kimo_store_nalvrz.jpg",
      location: "Sidi Beshr, Alex",
      link: "https://maps.app.goo.gl/V5yUZYmYaabXpc5x8",
>>>>>>> b8178fc5b7074cb92d6162f164c815e106483108
      rating: 5,
    },
    {
      id: 2,
<<<<<<< HEAD
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

=======
      title: "Shiko Store",
      image: "https://res.cloudinary.com/dr9yx1tod/image/upload/v1746552230/Shiko_store_tqmrex.jpg",
      location: "45 Street, Alex",
      link:"https://maps.app.goo.gl/1MpHH86HCPci18Wf8",
      rating: 5,
    },
    {
      id: 3,
      title: "BTECH Mini Store",
      image: "https://res.cloudinary.com/dr9yx1tod/image/upload/v1746552228/b_tech_xmlhtw.jpg",
      location: "Al Shatby, Alex",
      link:"https://www.google.com/maps/place/BTECH+Mini+-+Al+Ittihad+Club/@31.2092676,29.9087193,16z/data=!4m10!1m2!2m1!1z2YXZitmG2Yog2KrZgw!3m6!1s0x14f5c50f2fcb3fdd:0xbbf0a9d36c2d6a9a!8m2!3d31.2092676!4d29.9182465!15sCg3ZhdmK2YbZiiDYqtmDkgERZWxlY3Ryb25pY3Nfc3RvcmXgAQA!16s%2Fg%2F11vlvzlwk0?entry=ttu&g_ep=EgoyMDI0MTAwOS4wIKXMDSoASAFQAw%3D%3D",
>>>>>>> b8178fc5b7074cb92d6162f164c815e106483108
      rating: 5,
    },
    {
      id: 4,
<<<<<<< HEAD
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
=======
      title: "Sigma Computer Store",
      image: "https://res.cloudinary.com/dr9yx1tod/image/upload/v1746556399/sigma_imz6hd.png",
      location: "Roushdy, Alex",
      link:"https://maps.app.goo.gl/NzYJQhZiawZJUUmJ6",
      rating: 5,
    },
    {
      id: 5,
      title: "El-Batoul Store",
      image: "https://res.cloudinary.com/dr9yx1tod/image/upload/v1746552230/albatool_j43cuz.jpg",
      location: "Sidi Beshr, Alex",
      link:"https://maps.app.goo.gl/XNind2jY21bPXsAJ9",
      rating: 3.8,
    },
    {
      id: 6,
      title: "Paragon Store",
      image: "https://res.cloudinary.com/dr9yx1tod/image/upload/v1746552229/paragon_xukjsw.jpg",
      location: "Sidi Beshr, Alex",
      link:"https://maps.app.goo.gl/9WFaRgRrqH7ZpTQF6",
      rating: 4.3,
    },
    {
      id: 7,
      title: "Switch Plus Store",
      image: "https://res.cloudinary.com/dr9yx1tod/image/upload/v1746552229/switch_plus_hf8hsl.png",
      location: "Sidi Beshr, Alex",
      link:"https://maps.app.goo.gl/n6svxr87Cw7auXrW9",
      rating: 5,
    },
    {
      id: 8,
      title: "WeFixIt Egypt",
      image: "https://res.cloudinary.com/dr9yx1tod/image/upload/v1746552228/we_fix_it_dffloq.png",
      location: "Nasr City, Cairo",
      link:"https://maps.app.goo.gl/fbmVU9mKjZyNpLqe7",
      rating: 5,
    },
  ];
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll up smoothly
      navigate("/repair-shops");
    };
    
    
>>>>>>> b8178fc5b7074cb92d6162f164c815e106483108

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
<<<<<<< HEAD
        <button className="view-all-btn">View All Stores</button>
=======
        <button className="view-all-btn" onClick={handleSubmit}>View All Stores</button>
>>>>>>> b8178fc5b7074cb92d6162f164c815e106483108
      </div>
    </div>
  );
};

export default HomeStores;
