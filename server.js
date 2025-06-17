require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const compression = require('compression')
const morgan = require('morgan')
const app = express()
const cors = require("cors");

// Import routes
const communityRoutes = require('./routes/communityRoutes')
const userRoute = require('./routes/userRoute')
const specialistRoute = require('./routes/specialistRoute')
const serviceShopRoutes = require('./routes/serviceShopRoutes')
const windowsErrorRoutes = require('./routes/windowsErrorRoutes')
const helpSessionRoutes = require('./routes/helpSessionRoutes')
const forgotPassRoutes = require('./routes/forgotResetPassRoutes')
const scrapingRoutes = require('./routes/scrapingRoutes')
const uploadVideoRoutes = require("./routes/uploadVideosRoutes")
const uploadImageRoute = require("./routes/uploadImageRoute")
const contactUsRoute = require("./routes/contactUsRoute")
const mongoose = require('mongoose')

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false
}))

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
})

// Stricter rate limiting for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 auth requests per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
})

// Upload rate limiting
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit uploads
    message: {
        error: 'Too many upload attempts, please try again later.'
    }
})

app.use(limiter)

// Enable trust proxy if behind reverse proxy (nginx, cloudflare, etc.)
app.set('trust proxy', 1)

// Body parsing middleware with size limits
app.use(express.json())

app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
}))

// CORS configuration - be more specific in production
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true,
    maxAge: 86400 // Cache preflight for 24 hours
}
app.use(cors(corsOptions))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp())

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'))
} else {
    app.use(morgan('dev'))
}

// Custom security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    next()
})

// Request logging middleware (improved)
app.use((req, res, next) => { 
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`)
    next()
})

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

// Routes with specific rate limiting
app.use('/api/community/posts', communityRoutes)
app.use('/api/users', userRoute)
app.use('/api/specialists', specialistRoute)
app.use('/api/serviceShops', serviceShopRoutes)
app.use('/api/WindowsError', windowsErrorRoutes)
app.use('/api/helpSession', helpSessionRoutes)
app.use('/api/auth', authLimiter, forgotPassRoutes) // Apply stricter rate limiting
app.use('/api/scraping', scrapingRoutes)
app.use('/api/upload/', uploadLimiter, uploadVideoRoutes) // Apply upload rate limiting
app.use('/api/uploadImage/', uploadLimiter, uploadImageRoute) // Apply upload rate limiting
app.use('/api/contactUs', contactUsRoute)

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    })
})

// Global error handler
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`)
    console.error(err.stack)
    
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    res.status(err.status || 500).json({
        error: isDevelopment ? err.message : 'Internal Server Error',
        ...(isDevelopment && { stack: err.stack })
    })
})

// Enhanced MongoDB connection with security options
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

// Graceful shutdown
const gracefulShutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`)
    
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed.')
        process.exit(0)
    })
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// MongoDb Connection with enhanced error handling
mongoose.connect(process.env.MONGO_URI, mongoOptions)
    .then(() => {
        console.log('Connected to MongoDB successfully')
        
        // Start server
        const PORT = process.env.PORT || 4000
        const server = app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
        })
        
        // Handle server errors
        server.on('error', (err) => {
            console.error('Server error:', err)
        })
        
        // Set server timeout
        server.timeout = 30000 // 30 seconds
        
    })
    .catch(err => {
        console.error('MongoDB connection error:', err)
        process.exit(1)
    })

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Promise Rejection:', err)
    mongoose.connection.close(() => {
        process.exit(1)
    })
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    mongoose.connection.close(() => {
        process.exit(1)
    })
})