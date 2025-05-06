import React, { useState } from 'react';


const ProfileSidebar = () => {
  return (

    <div className="profile-sidebar">
      <h2 className="sidebar-title">Manage My Account</h2>
      <div className="sidebar-section">
        <span className="sidebar-link active">My Profile</span>
        <span className="sidebar-link">My Payment Options</span>
      </div>
      <div className="sidebar-section">
        <span className="sidebar-link">My Orders</span>
      </div>
      <div className="sidebar-section">
        <span className="sidebar-link">My Cancellations</span>
      </div>
    </div>
  );
};

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="profile-form">
      <div className="profile-header">
        <h2 className="profile-title">Edit Your Profile</h2>
        <span className="welcome-text">Welcome! {formData.firstName} {formData.lastName}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="password-section">
          <h3>Password Changes</h3>
          <div className="form-group">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <div className="content-container">
      <ProfileSidebar />
      <ProfileForm />

    </div>
  );
};

export default ProfilePage;
