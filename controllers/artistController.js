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

export const getArtistsPaginated = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Defaults: page 1, limit 10
        const artists = await Artist.find()
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Artist.countDocuments();

        res.status(200).json({
            page: Number(page),
            limit: Number(limit),
            total,
            data: artists,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const searchArtists = async (req, res) => {
    try {
        const { query } = req.query;

        const artists = await Artist.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { stageName: { $regex: query, $options: 'i' } }
            ],
        });

        if (artists.length === 0) {
            return res.status(404).json({ message: "No artists found" });
        }

        res.status(200).json(artists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const rateArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5." });
        }

        const artist = await Artist.findById(id);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        if (!artist.ratings) {
            artist.ratings = [];
        }

        artist.ratings.push(rating);

        artist.averageRating =
            artist.ratings.reduce((sum, r) => sum + r, 0) / artist.ratings.length;

        await artist.save();

        res.status(200).json({ averageRating: artist.averageRating });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getArtistsWithExperience = async (req, res) => {
    try {
        const artists = await Artist.find();

        const artistsWithExperience = artists.map(artist => {
            const yearsOfExperience = new Date().getFullYear() - new Date(artist.careerStartDate).getFullYear();
            return { ...artist.toObject(), yearsOfExperience };
        });

        res.status(200).json(artistsWithExperience);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const toggleFollowArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // Assuming a user ID is sent in the request

        const artist = await Artist.findById(id);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        if (!artist.followers) {
            artist.followers = [];
        }

        if (artist.followers.includes(userId)) {
            // Unfollow
            artist.followers = artist.followers.filter(follower => follower !== userId);
        } else {
            // Follow
            artist.followers.push(userId);
        }

        await artist.save();

        res.status(200).json({ followers: artist.followers.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getArtistDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const artist = await Artist.findById(id);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        res.status(200).json(artist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getTopRatedArtists = async (req, res) => {
    try {
        const artists = await Artist.find()
            .sort({ averageRating: -1 }) // Sort by average rating descending
            .limit(10); // Limit to top 10

        res.status(200).json(artists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getMostFollowedArtists = async (req, res) => {
    try {
        const artists = await Artist.find()
            .sort({ followers: -1 }) // Sort by followers descending
            .limit(10); // Limit to top 10

        res.status(200).json(artists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const updateSocialLinks = async (req, res) => {
    try {
        const { id } = req.params;
        const { socialLinks } = req.body;

        const artist = await Artist.findById(id);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        artist.socialLinks = socialLinks || [];
        await artist.save();

        res.status(200).json(artist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
