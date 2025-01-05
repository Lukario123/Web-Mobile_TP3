import Artist from "../models/Artist.js";

export const getArtists = async (req, res)=> {
    try {
     // Retrieve all artists from the database
     const artists = await Artist.find();

     // Check if no artists were found
     if (artists.length === 0) {
         return res.status(404).json({ message: "No artists found" });
     }

     // Return the list of artists
     res.status(200).json(artists);
 } catch (err) {
     // Handle any errors and return a 500 status
     console.error(err); // Log error for debugging
     res.status(500).json({ error: "Internal Server Error" });
 }
};

export const createArtist = async (req, res) => {
    try {

    const { name,stageName } = req.body;

        // Check if an artist with the given email already exists
        const existingArtist = await Artist.findOne({ name,stageName });
        if (existingArtist) {
            return res.status(400).json({ message: "Artist already exists" });
        }

        // Create a new artist
        const artist = new Artist(req.body);
        const savedArtist = await artist.save();

        res.status(201).json(savedArtist); // Return the saved artist
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const updateArtist = async (req, res) => {
    try {
    const { id } = req.params;

    // Check if the artist exists
    const artistExists = await Artist.findById(id);
    if (!artistExists) {
        return res.status(404).json({ message: "Artist not found" });
    }

    // Update the artist and return the updated document
    const updatedArtist = await Artist.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    res.status(200).json(updatedArtist); // Respond with the updated artist
} catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: "Internal Server Error" });
}
};

export const deleteArtist = async (req, res) => {
    try {
        const { id } = req.params; // Correct destructuring

        // Check if the artist exists
        const artistExists = await Artist.findById(id);
        if (!artistExists) {
            return res.status(404).json({ message: "Artist not found" });
        }

        // Delete the artist
        await Artist.findByIdAndDelete(id);
        res.status(200).json({ message: "Artist deleted successfully" });
    } catch (err) {
        console.error("Error occurred:", err); // Log the error for debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
};


