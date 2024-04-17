import React from 'react';
import { useRouter } from 'next/router';

const ProfilePage = () => {

    const router = useRouter();

    // Retrieve JSON data from query parameters and parse it back to JSON object
    const jsonData = JSON.parse(router.query.jsonData);

  // Sample data for demonstration
  const userProfile = {
    coverImage: 'https://linkstorage.linkfire.com/medialinks/images/41ed6cef-fd3f-40f5-9cdd-e157e19ff561/artwork-440x440.jpg',
    profileImage: 'https://linkstorage.linkfire.com/medialinks/images/41ed6cef-fd3f-40f5-9cdd-e157e19ff561/artwork-440x440.jpg',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et ligula eget mauris scelerisque mattis sit amet in turpis. Integer at tristique arcu. Proin ut lectus vel eros ultricies dignissim.',
    socialLinks: [
      { platform: 'LinkedIn', link: 'https://linkedin.com/in/username', icon: 'https://e7.pngegg.com/pngimages/194/58/png-clipart-computer-icons-css-sprites-facebook-page-company-logo.png' },
      { platform: 'LinkedIn', link: 'https://linkedin.com/in/username', icon: 'https://e7.pngegg.com/pngimages/194/58/png-clipart-computer-icons-css-sprites-facebook-page-company-logo.png' },
      { platform: 'LinkedIn', link: 'https://linkedin.com/in/username', icon: 'https://e7.pngegg.com/pngimages/194/58/png-clipart-computer-icons-css-sprites-facebook-page-company-logo.png' },
      { platform: 'LinkedIn', link: 'https://linkedin.com/in/username', icon: 'https://e7.pngegg.com/pngimages/194/58/png-clipart-computer-icons-css-sprites-facebook-page-company-logo.png' },
      { platform: 'LinkedIn', link: 'https://linkedin.com/in/username', icon: 'https://e7.pngegg.com/pngimages/194/58/png-clipart-computer-icons-css-sprites-facebook-page-company-logo.png' },
      { platform: 'LinkedIn', link: 'https://linkedin.com/in/username', icon: 'https://e7.pngegg.com/pngimages/194/58/png-clipart-computer-icons-css-sprites-facebook-page-company-logo.png' },
      { platform: 'LinkedIn', link: 'https://linkedin.com/in/username', icon: 'https://e7.pngegg.com/pngimages/194/58/png-clipart-computer-icons-css-sprites-facebook-page-company-logo.png' },
      { platform: 'LinkedIn', link: 'https://linkedin.com/in/username', icon: 'https://e7.pngegg.com/pngimages/194/58/png-clipart-computer-icons-css-sprites-facebook-page-company-logo.png' },
      { platform: 'LinkedIn', link: 'https://linkedin.com/in/username', icon: 'https://e7.pngegg.com/pngimages/194/58/png-clipart-computer-icons-css-sprites-facebook-page-company-logo.png' },
    ],
  };

  alert(jsonData);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
    <img src={userProfile.coverImage} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover', filter: 'blur(30px)' }} />
      <div style={{ textAlign: 'center', marginTop: '-100px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={userProfile.profileImage} alt="Profile" style={{ width: '200px', height: '200px', borderRadius: '50%', border: '4px solid white' }} />
        </div>
        <h1 style={{ fontWeight: 'bold' }}>El 3aks Sa7i7 - Single</h1>
        <p>Choose music service</p>
        <div className="social-links" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="social-link-card" style={{ marginBottom: '10px',marginTop: '40px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {userProfile.socialLinks.map((link, index) => (
             <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: index !== userProfile.socialLinks.length - 1 ? '1px solid #ccc' : 'none', paddingBottom: index !== userProfile.socialLinks.length - 1 ? '10px' : '0', width: '400px' }}>
             <div style={{ display: 'flex', alignItems: 'center' }}>
               <img src={link.icon} alt={link.platform} style={{ width: '50px', marginRight: '10px' }} />
               <span style={{ fontWeight: 'bold' }}>{link.platform}</span>
             </div>
             <button style={{ marginLeft: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', padding: '5px 10px', border: 'none' }}>Play</button>
           </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
