import { useState, useEffect, useRef } from 'react';
import { useGetProfile } from '../../Hooks/usegetProfile';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { useUpdateProfile } from '../../Hooks/useUpdateProfile';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Profile.module.css';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileImage, setProfileImage] = useState('')
  const [initialData, setInitialData] = useState(null);
  const { user } = useAuthContext();  
  const { isLoading, error, getProfile } = useGetProfile(); 
  const { updateLoading, UpdateError, updateProfile } = useUpdateProfile()
  const [imageUploading, setImageUploading] = useState(false);

  const fileInputRef = useRef();


  // Flag to ensure the profile fetch happens only once
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    if (!user?.token || !user?._id || profileFetched) {
      // If no user token or userId or already fetched, skip fetching
      return;
    }

    // fetch profile data
    const fetchProfile = async () => {
      
      const profile = await getProfile(); 
      
      if (profile) {
        
        setUsername(profile.username || '');
        setEmail(profile.email || '');
        setPhone(profile.phone_number || '');
        setProfileImage(profile.profile_image || '')
        setInitialData({
          username: profile.username || '',
          email: profile.email || '',
          phone: profile.phone_number || '',
          profileImage: profile.profile_image || "https://res.cloudinary.com/dr9yx1tod/image/upload/v1748907333/gnxjl4smryaxenstarj8.jpg"
        });
        setProfileFetched(true);  // Mark as fetched
      }
    };

    fetchProfile(); // Fetch the profile only once
  }, [user, profileFetched, getProfile]); 

  const handleCancel = () => {
    if (initialData) {
      setUsername(initialData.username);
      setEmail(initialData.email);
      setPhone(initialData.phone);
      setProfileImage(initialData.profileImage)
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

  let updatedFields = {
    ...(username !== initialData.username && { username }),
    ...(phone !== initialData.phone && { phone_number: phone }),
    ...(email !== initialData.email && { email }),
    ...(currentPassword && newPassword && {
      currentPassword,
      newPassword,
      confirmPassword: confirmNewPassword
    }),
    ...(profileImage !== initialData.profileImage && { profile_image: profileImage}),

  };

  // Always include email so backend can identify user even if unchanged
  updatedFields = { email, ...updatedFields };

  if (Object.keys(updatedFields).length === 1) {
    toast.warn("No changes detected.");
    return;
  }

  const result = await updateProfile(updatedFields);

    if (result) {
      toast.success('profile updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          });
                  // Redirect after a short delay
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setInitialData({
        username: result.username || '',
        email: result.email || '',
        phone: result.phone_number || ''
      });
    }
  };

  const handleEditImage = () => { 
    fileInputRef.current.click();
    console.log("Edited")
  }

  // handle File Change
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('profile-image', file);
  setImageUploading(true); // Start spinner

  try {
    // Upload image to Cloudinary
    const response = await fetch('/api/users/upload/profile-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    if (data?.imageUrl) {
      // Update image in DB
      const updateResponse = await fetch(`/api/users/profile-image/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ profile_image: data.imageUrl }),
      });

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateData.error || 'Failed to update DB');
      }

      setProfileImage(data.imageUrl);
      toast.success('Profile image updated!');
      setInitialData((prev) => ({
        ...prev,
        profileImage: data.imageUrl,
      }));
    }
  } catch (error) {
    console.error(error);
    toast.error("Image upload or update failed");
  } finally {
    setImageUploading(false); // Stop spinner
  }
};


  return (
    <div className="content-container">
                <ToastContainer />
      <div className="profile-sidebar">
        <h2 className="sidebar-title">Manage My Account</h2>
        <div className="sidebar-section">
          <span className="sidebar-link active">My Profile</span>
        </div>
        <div className={styles.avatarContainer}>
          {isLoading || imageUploading ? (
            // <p>Loading profile...</p>
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>) : (
            <img
              src={profileImage}
              alt="user Image"
              className={styles.avatarImage}
            />
          )}

          <button
            className={styles.editButton}
            onClick={handleEditImage}
            title="Edit Profile Picture"
          >
          ✏️
          </button>
          
          <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
          />

          
        </div>
      </div>

      <div className="profile-form">
        <div className="profile-header">
        {error && <div className="error">{error}</div>}
          <h2 className="profile-title">Edit Your Profile</h2>
          <span className="welcome-text">Welcome!  {<span className='ProfileUsername'>{ username }</span>}</span>
        </div>

        {isLoading ? (
          // <p>Loading profile...</p>
          <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
        {UpdateError && <div className='error'>{ UpdateError}</div>}

            <div className="password-section">
              <h3>Password Changes</h3>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btnn" onClick={handleCancel}>
                Reset Changes
              </button>
                <button disabled={ updateLoading } type="submit" className="save-btnn">
                  { updateLoading ? "updating...." : "Save Changes" }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
