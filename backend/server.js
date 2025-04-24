import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/bookings', bookingRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("JetSetGO Backend Running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
