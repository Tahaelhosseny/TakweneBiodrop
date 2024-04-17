import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import BlankLayout from '../components/layouts/BlankLayout'; // Adjust the path as needed

const ProfilePage = () => {
  const router = useRouter();
  const releaseName = router.query.releaseName;
  const [release, setRelease] = useState([]);

  useEffect(() => {
    const fetchRelease = async () => {
      if(releaseName)
      {
        try {
          const response = await axios.get('http://localhost:3000/api/release/getBySubLink?query=' + releaseName);
          if(response.status === 200)
          {
            setRelease(response.data);
          }else{
            router.push("http://localhost:3000/404");
          }
          // Assuming response.data is an array of releases
          
      } catch (error) {
        router.push("http://localhost:3000/404");
      }
      }
      
    
    };

    fetchRelease();
  }, [releaseName]);

  const handlePlayButtonClick = async (linkId) => {
     try {
            await axios.get('http://localhost:3000/api/releaseLinks/updateClick?query=' + linkId);
        } catch (error) {
            console.error('Error fetching release:', error.message);
        }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      <img src={release.artWorkUrl} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover', filter: 'blur(30px)' }} />
      <div style={{ textAlign: 'center', marginTop: '-100px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={release.artWorkUrl} alt="Profile" style={{ width: '200px', height: '200px', borderRadius: '50%', border: '4px solid white' }} />
        </div>
        <h1 style={{ fontWeight: 'bold' }}>{release.title}</h1>
        <p>Choose music service</p>
        <div className="social-links" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="social-link-card" style={{ marginBottom: '10px', marginTop: '40px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {release.platforms && release.platforms.map((link, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '400px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={link.icon} alt={link.title} style={{ width: '50px', marginRight: '10px' }} />
                  <span style={{ fontWeight: 'bold' }}>{link.name}</span>
                </div>
                <a href={link.url.startsWith('http') ? link.url : `http://${link.url}`} target="_blank" rel="noopener noreferrer">
                  <button
                    style={{ marginLeft: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', padding: '5px 10px', border: 'none' }}
                    onClick={() => handlePlayButtonClick(link._id)}
                  >
                    Play
                  </button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


ProfilePage.getLayout = function getLayout(page) {
  return <BlankLayout>{page}</BlankLayout>;
};
