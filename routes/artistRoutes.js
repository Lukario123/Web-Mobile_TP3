import express from "express";
import { getArtists, createArtist, searchArtists, updateArtist, deleteArtist, rateArtist, getArtistsPaginated, getArtistsWithExperience, toggleFollowArtist, getArtistDetails, getTopRatedArtists, getMostFollowedArtists, updateSocialLinks } from "../controllers/artistController.js";
const route = express.Router();

route.post("/create", createArtist);
route.get('/fetchAll', getArtists);
route.get('/search', searchArtists);
route.get('/pagination', getArtistsPaginated);
route.put('/update/:id', updateArtist);
route.delete('/delete/:id', deleteArtist);
route.post('/rate/:id', rateArtist);
route.get('/experience', getArtistsWithExperience);
route.post('/follow/:id', toggleFollowArtist);
route.get('/details/:id', getArtistDetails);
route.get('/topRated', getTopRatedArtists);
route.get('/mostFollowed', getMostFollowedArtists);
route.get('social', updateSocialLinks);

export default route;
// module.exports = router;

