import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    stageName: { type: String, required: true },
    image: { type: String },
    albums: { type: Number, default: 0 },
    socialLinks: { type: [String], default: [] },
    recordLabel: { type: String },
    publishingHouse: { type: String, required: true},
    careerStartDate: { type: Date, required: true}
});

export default mongoose.model('Artist', ArtistSchema);
// module.exports = mongoose.model('Artist', ArtistSchema);

