import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    image: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const About = mongoose.model('About', aboutSchema);
export default About;