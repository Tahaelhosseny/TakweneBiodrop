import connectMongo from "@config/mongo";
import logger from "@config/logger";
import { lighten } from '@storybook/theming';
import { Line } from "recharts";
import { Link } from "@models/index";


export default async function handler(req, res) 
{
  try {
    const { segments,query } = req.query;
    if (segments && segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      switch (lastSegment) 
      {
        case 'updateClick':
          await updateClick(req, res,query);
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


async function updateClick(req, res,query) {
    try {
      await connectMongo();
      
      var linkId = query;
  
      var link =await Link.findOne({_id : linkId});
     
      if (link) {
        link.clicks = link.clicks+1;
        await link.save();
        res.status(200).json(link);
      } else {
        res.status(404).json( null );
      }
      res.status(200).json(linkId );

    } catch (error) 
    {
      res.status(500).json(null );
    }
  }