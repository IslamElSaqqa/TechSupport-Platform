import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ContactInfoSection = () => {
  return (
    
    <div className="contact-info-section">
      <div className="contact-info-container">
        <div className="contact-group">
          <div className="header-group">
            <img src="https://dashboard.codeparrot.ai/api/image/Z9DVgyppvFKitT9L/icons-ph.png" alt="Phone Icon" className="icon" />
            <h3 className="section-title">Call Us</h3>
          </div>
          <div className="info-text">
            <p>We are available all days of a week.</p>
            <p>Phone: +201556381767</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="contact-group">
          <div className="header-group">
            <img src="https://dashboard.codeparrot.ai/api/image/Z9DVgyppvFKitT9L/icons-ma.png" alt="Mail Icon" className="icon" />
            <h3 className="section-title">Write US</h3>
          </div>
          <div className="info-text">
            <p>Fill out our form and we will contact you within 24 hours.</p>
            <p>Email: divomobilerepairs@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactFormSection = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setLoading] = useState(null)
    const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const formData = {name,email,phone, message}
      const response = await fetch('/api/contactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
      );
      const json = await response.json()
      if (!response.ok) { 
        setError(json.error || 'Error posting form data!')
      }
      if (response.ok) { 
        setError(null)
        setEmail('')
        setName('')
        setPhone('')
        setMessage('')
        toast.success('Message sent successfully!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
        });
      }
      
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="contact-form-section">
      {error && <div className='error'>{error}</div>}
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="input-row">
          <div className="input-group-contact">
            <input
              type="text"
              placeholder="Your Name "
              value={name}
              onChange={(e)=> setName(e.target.value)}
            />
          </div>
          <div className="input-group-contact">
            <input
              type="email"
              placeholder="Your Email "
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>
          <div className="input-group-contact">
            <input
              type="tel"
              placeholder="Your Phone "
              value={phone}
              onChange={(e)=> setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="message-group">
          <textarea
            name="message"
            placeholder="Your Message"
            rows={8}
            value={message}
            onChange={(e)=> setMessage(e.target.value)}

          />
        </div>
        <div className="button-container">
          <button disabled={ isLoading } type="submit" className="submit-button">
            {isLoading ? "sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
};

const ContactUs = () => {
  return (
    <div className="content-container-contact">

    <div className="contact-layout">
      <ContactInfoSection />
      <ContactFormSection />
    </div>
    </div>
  );
};

export default ContactUs;
