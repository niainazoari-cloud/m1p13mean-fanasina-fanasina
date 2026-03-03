const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./src/config/database.config');
const { errorHandler, notFound } = require('./src/middleware/error');

// Import routes
const authRoutes = require('./src/routes/authroute');
const productRoutes = require('./src/routes/productroute');
const shopRoutes = require('./src/routes/shoproute');
const cartRoutes = require('./src/routes/cartroute');
const orderRoutes = require('./src/routes/orderroute');
const dashboardRoutes = require('./src/routes/dashboardroute');
const promotionRoutes = require('./src/routes/promotionroute');
const reviewRoutes = require('./src/routes/reviewroute');

const app = express();

// Connexion MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes, veuillez réessayer plus tard'
});
app.use('/api/auth', limiter);

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serveur opérationnel',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Seed route (pour tests)
const seedData = require('./src/seed');
app.post('/api/seed', seedData);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📝 Environnement: ${process.env.NODE_ENV || 'development'}`);
});