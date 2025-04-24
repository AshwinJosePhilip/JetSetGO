import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const About = mongoose.model('About', aboutSchema);
export default About;