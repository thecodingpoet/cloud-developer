import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app: Application = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    const imageUrl: string = req.query && req.query.image_url

    if (!imageUrl) {
      return res.status(422).send('You need to provide a image url')
    }

    const filteredImage: string = await filterImageFromURL(imageUrl)
    
    res.sendFile(filteredImage)

    res.on('finish', async () => {
      await deleteLocalFiles([filteredImage]) 
    });
  } );


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response  ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();