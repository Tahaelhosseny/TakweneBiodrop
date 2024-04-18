import axios from 'axios';
import connectMongo from "@config/mongo";
import { Release } from "@models/index";
import { Link } from "@models/index";
import logger from "@config/logger";



export default async function handler(req, res) 
{
  try {
    const { segments,query } = req.query;
    if (segments && segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      switch (lastSegment) 
      {
        case 'scan':
          await scanUpsIsrc(req, res,query);
          break;
        case 'searchdb':
          await searchdb(req, res,query);
          break;
        case 'getById':
          await getById(req, res,query);
          break;
        case 'createLink':
          await CreateLink(req, res,query);
          break;
        case 'GetPlatforms':
          await GetPlatforms(req, res);
          break;
        case 'get':
          await Get(req, res,query);
          break;
          case 'updateLink':
          await UpdateLink(req, res,query);
          break;
          case 'getBySubLink':
          await getBySubLink(req, res,query);
          break;
          case 'searchReleases':
          await searchReleases(req, res,query);
          break;
        default:
          res.status(500).json({ error: 'Function not found' });
      }
    } else {
      return "Hi";
      
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function searchdb(req, res,query) {
  try {
    await connectMongo();
    
    var releaseSubLink = query;

    var release =await Release.findOne({releaseSubLink : releaseSubLink});
    if (release) {
      res.status(200).json(release);
    } else {
      res.status(404).json( null );
    }
    
  } catch (error) 
  {
    res.status(500).json(null );
  }
}

/*async function searchReleases(req, res,query) {
  try {
    await connectMongo();

    // Define the search criteria using $or operator
    const searchCriteria = {
      $or: [
        { title: query }, 
        { releaseSubLink: query },
        { upc: query },
        { isrc: query },
      ]
    };


    // Find releases that match the search criteria
    const releases = await Release.find(searchCriteria).sort({ createdAt: -1 });

    if (releases.length > 0) {
      res.status(200).json(releases);
    } else {
      res.status(200).json(releases);
    }
  } catch (error) {
    res.status(500).json(null);
  }
}*/


async function searchReleases(req, res, query) {
  const page = parseInt(req.query.page) || 1; // Get the page number from the request query parameters, default to 1 if not provided
  const perPage = 1; // Number of items per page
  const skip = (page - 1) * perPage; // Calculate the number of items to skip

  console.error();
  try {
    await connectMongo();

    // Define the search criteria using $or operator
    const searchCriteria = {
      $or: [
        { title: query }, 
        { releaseSubLink: query },
        { upc: query },
        { isrc: query },
      ]
    };

    // Find releases that match the search criteria, with pagination
    const releases = await Release.find(searchCriteria)
                                  .sort({ createdAt: -1 })
                                  .skip(skip)
                                  .limit(perPage);

    if (releases.length > 0) {
      res.status(200).json(releases);
    } else {
      res.status(200).json(releases);
    }
  } catch (error) {
    res.status(500).json(null);
  }
}


async function getById(req, res,query) 
{
  try {
    await connectMongo();
    var id = query;
    var release =await Release.findOne({_id : id}).populate('platforms');
    if (release) {
      res.status(200).json( release );
    } else {
      res.status(404).json(null );
    }
    
  } catch (error) 
  {
    res.status(500).json({ user: null });
  }
}

async function getBySubLink(req, res,query) 
{
  try {
    await connectMongo();
    var releaseSubLink = query;
    
    var release =await Release.findOne({releaseSubLink : releaseSubLink}).populate('platforms');
    if (release) {
      res.status(200).json( release );
    } else {
      res.status(404).json(null );
    }
    
  } catch (error) 
  {
    res.status(500).json({ user: null });
  }
}


async function scanUpsIsrc(req, res,query) {
  try {
    // Fetch data from the API
    //const response = await axios.get('https://goapilive.takwene.com/api/v1/ReleasePlatformsDistribution/Scan?text=EGA252201974');
    const response = await axios.get('https://goapilive.takwene.com/api/v1/ReleasePlatformsDistribution/Scan?text='+query);
    const data = response.data;
    const jsonData = JSON.parse(JSON.stringify(response.data));
    res.status(200).json({ result: jsonData });

  } catch (error) {
    // Handle errors
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function GetPlatforms(req, res) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxZWFkMmYyNy01YmJlLTQxMzAtOTA0NS1kZDk2ZDVjZTExNWUiLCJlbWFpbCI6Im1vaGFtZWQucmFhZmF0QHRha3dlbmUuY29tIiwibmJmIjoxNjg2NjQ1MDkyLCJleHAiOjE3MzM5NDkwOTIsImlhdCI6MTY4NjY0NTA5MiwiaXNzIjoiaHR0cHM6Ly9Hb0FwaUxpdmUudGFrd2VuZS5jb20vIiwiYXVkIjoibW9iIn0.i3_parVVB2ghsCBF6ELir9h7hEq1P6QS7BBwhBJKi14`
      }
    };
    const response = await axios.get('https://goapilive.takwene.com/api/v1/DSP/GetMonetized',config);
    const data = response.data;
    const jsonData = JSON.parse(JSON.stringify(response.data.result));
    res.status(200).json(jsonData );

  } catch (error) {
    // Handle errors
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function CreateLink(req, res,query)
{
  const data  = req.body;
  await connectMongo();
    let linkIds = [];
    var release = {
      releaseSubLink : data.releaseSubLink,
      title:data.title,
      upc:data.upc,
      isrc:data.isrc,
      artWorkUrl:data.artWorkUrl,
      preview:data.preview
    };
    release = await Release.create(release);
    await Promise.all(data.platforms.map(async (link)=> {
      var dbLink = {
        username : release.title,
        release:release.id,
        name:link.name,
        icon:link.icon,
        url:link.url
      };
      dbLink = await Link.create(dbLink);
      linkIds.push(dbLink.id);
    }));
    
    release.platforms = linkIds;
    await Release.findByIdAndUpdate(release.id, release);
  res.status(200).json({ result: data.title });
}
/*async function Get(req, res,query)
{
  await connectMongo();

  try {
    // Retrieve releases from MongoDB
    const releases = await Release.find().sort({ createdAt: -1 });
    
    res.status(200).json(releases );
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}*/
async function Get(req, res, query) {
  await connectMongo();

  try {
    const page = parseInt(query) || 1; // Default to page 1 if not specified
    const perPage = 5; // Number of items per page

    // Calculate skip value to skip items for previous pages
    const skip = (page - 1) * perPage;
    
    // Retrieve releases from MongoDB with pagination
    const releases = await Release.find()
                                 .sort({ createdAt: -1 })
                                 .skip(skip)
                                 .limit(perPage);

    res.status(200).json(releases);
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function UpdateLink(req, res, query) {
  const data = req.body;
  await connectMongo();
  logger.info(data);

  try {
      let release = await Release.findById(data._id);

      if (!release) {
          return res.status(404).json({ error: 'Release not found' });
      }    

      release.releaseSubLink = data.releaseSubLink;
      release.title = data.title;
      release.upc = data.upc;
      release.isrc = data.isrc;
      release.artWorkUrl = data.artWorkUrl;
      release.preview = data.preview;
      await release.save();
      const updatedLinkIds = [];
    await Promise.all(data.platforms.map(async (link) => {
      if (link.id) {
        // Update existing link
        let existingLink = await Link.findOneAndUpdate(
          { _id: link._id },
          { $set: { icon: link.icon, url: link.url,name:link.name,release:data._id,username:data.username } },
          { new: true }
        );
        if (existingLink) {
          updatedLinkIds.push(existingLink.id);
        }
      } else {
        // Create new link
        let newLink = new Link({ icon: link.icon, url: link.url,name:link.name,release:data._id,username:data.username });
        let savedLink = await Link.create(newLink);
        updatedLinkIds.push(savedLink.id);
      }
    }));
      logger.info(data);
      release.platforms = updatedLinkIds;
      await release.save();

      res.status(200).json({ result: true });
  } catch (error) {
      console.error('Error updating release:', error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
}



