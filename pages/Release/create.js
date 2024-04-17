import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const TitleForm = () => {
    const router = useRouter();
    const [isrcOrUpc , setIsrcOrUpc]= useState();
    const [releaseName, setReleaseName] = useState();
    const [release, setRelease] = useState({ title: '',releaseSubLink: '',artWorkUrl:'' ,upc:'',isrc:'',platforms:[]});
    const [Platforms, setPlatforms] = useState();
    const [titleError, setTitleError] = useState(null); // State variable for title input error message
    const [subLinkError, setSubLinkError] = useState(null); // State variable for title input error message

    const [newPlatform, setNewPlatform] = useState({
        name: '',
        icon: '',
        url: ''
    });
    useEffect(() => {
        const { query } = router.query;
        
        if (query) {
            fetchRelease(query);
            fetchPlatforms(); // Fetch platforms when component mounts
        }
    }, [router.query.query]);


    const fetchRelease = async (isrc) => {
        try {
            const response = await axios.get('http://localhost:3000/api/release/scan?query=' + isrc);
            /*setRelease(response.data.result.result);
            const transformedList = release.platforms.map(item => {
                return { ...item, name: item.title };
            });
            release.platforms = transformedList;*/ 
            const newPlatforms = response.data.result.result.platforms.map(item => {
                return {
                    url: item.url,
                    icon: item.logoFileName,
                    name: item.title,
                };
            });
            setRelease(prevRelease => ({ ...prevRelease, title: response.data.result.result.title ,platforms : newPlatforms, artWorkUrl :  response.data.result.result.artWorkUrl , isrc : response.data.result.result.isrc,upc : response.data.result.result.upc}));
            release.platforms
            console.error(release);
        } catch (error) {
            console.error('Error fetching release:', error.message);
        }
    };
    const fetchPlatforms = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/release/GetPlatforms');
            setPlatforms(response.data); // Assuming the response.data contains the array of platforms
            if (!response.ok) {
                throw new Error('Failed to fetch platforms');
            }
            const data = await response.json();
        } catch (error) {
            console.error('Error fetching platforms:', error.message);
        }
    };

    const fetchReleaseByTitle = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/release/searchdb?query='+release.releaseSubLink);            
            return response.data;
        } catch (error) {
            return null;

            console.error('Error fetching platforms:', error.message);
        }
    };

    const handleRemove = (index) => {
        const updatedPlatforms = [...release.platforms]; // Make a copy of platforms array
        updatedPlatforms.splice(index, 1); // Remove the platform at the specified index
        const updatedRelease = { ...release, platforms: updatedPlatforms }; // Update release with modified platforms
        setRelease(updatedRelease); // Update release state
    };

    const handleAddPlatform = (selectedPlatformIndex, platformUrl) => {
        // Your logic here to handle adding the platform
        console.log("Selected platform index:", selectedPlatformIndex);
        console.log("Platform URL:", platformUrl);
        // Example: Add the new platform to the state
        const updatedPlatforms = [
            ...release.platforms,
            { name: Platforms[selectedPlatformIndex].dsptitle, icon: Platforms[selectedPlatformIndex].logoFileName, url: platformUrl ,username : release.title , release:release._id}
        ];

        setRelease(prevRelease => ({ ...prevRelease, platforms: updatedPlatforms }));
    };

    const uploadImage = async (file) => {
        try {
          // Create FormData object
          const formData = new FormData();
          formData.append('image', file);
      
          const response = await fetch('http://localhost:3000/api/images/UploadReleaseImage', {
            method: 'POST',
            body: formData
          });
      
          if (!response.ok) {
            throw new Error('Error uploading image');
          }
      
          // Parse response JSON
          const data = await response.json();
          
          // Return the URL of the uploaded image
          return data.imageUrl;
        } catch (error) {
          console.error(error);
          throw error; // Rethrow the error for handling in the caller function
        }
      };
      
      const handleImageChange = async (file) => {
        try {
          // Upload the image
          const imageUrl = await uploadImage(file);
      
          // Update state with the URL of the uploaded image
          setRelease(prevRelease => ({ ...prevRelease, artWorkUrl: "http://localhost:3000"+imageUrl }));
        } catch (error) {
          // Handle error, show error message to the user, etc.
        }
      };
    const saveRelease = async ()=>{
        
        if(isValid(release.releaseSubLink))
        {
            var releaseSearch = await fetchReleaseByTitle();

            if(releaseSearch == null)
            {
                try {
                    const response = await axios.post('http://localhost:3000/api/release/createLink', release, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                
                    if (response.status !== 200) {
                        alert("Failed");
                    } else {
                        window.location.href = '/Release';
                        
                    }
                } catch (error) {
                    console.error('Error saving release:', error.message);
                }
                
                setSubLinkError(null);

            }else{
                setSubLinkError('Dublicated');

            }
        }else{
            setSubLinkError('Title must contain only English letters and numbers');
            return;
        }
    }
    const isValid = (text) => {
        // Check if the input string is null or undefined
        if (text == null) {
            return false; // Return false if the string is null or undefined
        }
    
        // Check if the input string is empty after trimming whitespace
        if (text.trim() === '') {
            return false; // Return false if the string is empty
        }
    
        // Regular expression to match only English letters and numbers
        const pattern = /^[a-zA-Z0-9]+$/;
        return pattern.test(text); // Return true if the string matches the pattern
    };
    

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
            {release && (
                <>
                    <img src={release.artWorkUrl} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover', filter: 'blur(5px)' }} />
                    <div style={{ textAlign: 'center', marginTop: '-100px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <label htmlFor="upload-photo" style={{ cursor: 'pointer' }}>
                        <div style={{ position: 'relative' }}>
                            <img src={release.artWorkUrl} alt="Profile" style={{ width: '200px', height: '200px', borderRadius: '50%', border: '4px solid white' }} />
                            <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'gray', padding: '2px', borderRadius: '50%' }}>
                                <img src='http://localhost:3000/changeimg.png' name="camera" style={{  height:'15px', margin:'15px' }} /> 
                            </div>
                        </div>
                    </label>
                    <input
                        id="upload-photo"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageChange(e.target.files[0])} // Handle image change function
                    />
                </div>
                        <div>
                            <p>release name :</p>

                            <input
                                type="text"
                                value={release.title}
                                onChange={(e) => setRelease(prevRelease => ({ ...prevRelease, title: e.target.value }))}
                                style={{ fontWeight: 'bold', border: 'none', borderBottom: '1px solid black' }}
                            />
                            {titleError && <p style={{ color: 'red' }}>{titleError}</p>} {/* Display error message if titleError is not null */}
                        </div>
                        <div style={{ display: 'flex'}} >
                            <div style={{ marginRight: '20px' ,marginTop : '20px'}}>
                                <p>SubLink :</p>
                                <input
                                    type="text"
                                    value={release.releaseSubLink}
                                    onChange={(e) => setRelease(prevRelease => ({ ...prevRelease, releaseSubLink: e.target.value }))}
                                    style={{ fontWeight: 'bold', border: 'none', borderBottom: '1px solid black' }}
                                />
                                {subLinkError && <p style={{ color: 'red' }}>{subLinkError}</p>}
                            </div>
                            <div style={{ marginRight: '20px' ,marginTop : '20px'}}>
                                <p>UPC :</p>
                                <input
                                    type="text"
                                    value={release.upc}
                                    onChange={(e) => setRelease(prevRelease => ({ ...prevRelease, upc: e.target.value }))}
                                    style={{ fontWeight: 'bold', border: 'none', borderBottom: '1px solid black' }}
                                />
                                {subLinkError && <p style={{ color: 'red' }}>{subLinkError}</p>}
                            </div>
                            <div style={{ marginRight: '20px' ,marginTop : '20px'}}>
                                <p>ISRC :</p>
                                <input
                                    type="text"
                                    value={release.isrc}
                                    onChange={(e) => setRelease(prevRelease => ({ ...prevRelease, isrc: e.target.value }))}
                                    style={{ fontWeight: 'bold', border: 'none', borderBottom: '1px solid black' }}
                                />
                                {subLinkError && <p style={{ color: 'red' }}>{subLinkError}</p>}
                            </div>
                        </div>

                       
                        <p>Add music service</p>
                        <div className="social-links" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="social-link-card" style={{ marginBottom: '10px', marginTop: '40px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {release.platforms && release.platforms.map((link, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '400px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img src={link.icon} alt={link.name} style={{ width: '50px', marginRight: '10px' }} />
                                            <span style={{ fontWeight: 'bold' }}>{link.name}</span>
                                        </div>
                                        <div>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                <button
                                                    style={{ marginLeft: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', padding: '5px 10px', border: 'none' }}
                                                >
                                                    Play
                                                </button>
                                            </a>
                                            <button onClick={() => handleRemove(index)} style={{ backgroundColor: 'red', color: 'white', borderRadius: '5px', padding: '5px 10px', border: 'none', marginLeft :"5px" , margiRight :"5px" }}>
                                                    Remove
                                                </button>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <select
                            value={newPlatform.name}
                            onChange={(e) => setNewPlatform({ ...newPlatform, name: e.target.value })}
                        >
                            <option value="">Select Platform</option>
                            {Platforms && Platforms.map((platform, index) => (
                                <option key={index} value={index}>{platform.dsptitle}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="URL"
                            onChange={(e) => setNewPlatform({ ...newPlatform, url: e.target.value })}
                        />
                        <button onClick={() => handleAddPlatform(newPlatform.name, newPlatform.url)} style={{ backgroundColor: 'green', color: 'white', borderRadius: '5px', padding: '5px 10px', border: 'none', marginLeft :"5px" , margiRight :"5px" }}>
                            Add
                        </button>
                    </div>
                    <button onClick={() => saveRelease()} style={{ backgroundColor: '#007bff', color: 'white', borderRadius: '5px', padding: '5px 10px', border: 'none', }}>
                            Save Release
                        </button>
                </>
            )}
        </div>
    );
};

export default TitleForm;
