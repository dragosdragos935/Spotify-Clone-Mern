import { addSong,listSong,removeSong,getSongDetails } from "../controllers/songController.js";
import express from 'express'
import upload from "../middleware/multer.js";

const songRouter = express.Router();

songRouter.post('/add',upload.fields([
    {name:'image',maxCount:1},
    {name:'audio',maxCount:1},
    {name:'video',maxCount:1},
    {name:'lyrics',maxCount:1}
]),addSong);
songRouter.get('/list',listSong);
songRouter.post('/remove',removeSong);
songRouter.get('/:id/details',getSongDetails);

export default songRouter;