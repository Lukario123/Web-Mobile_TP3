import express from "express";
import { getArtists, createArtist, updateArtist, deleteArtist } from "../controllers/artistController.js";
// const { createArtist, getArtists, updateArtist, deleteArtist } = require('../controllers/artistController');
const route = express.Router();

route.post("/create", createArtist);
route.get('/fetchAll', getArtists);
route.put('/update/:id', updateArtist);
route.delete('/delete/:id', deleteArtist);

export default route;
// module.exports = router;

