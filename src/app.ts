
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';


const app = express();

// rate limiter middleware
const limiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 30, // Limit each IP to 30 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  headers: true, // Adds RateLimit headers to the response
});

// Apply rate limiter to all API routes
app.use(limiter);


// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Protect against HPP, should come before any routes
app.use(hpp());



// Use helmet middleware with CSP configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", `${process.env.SECURE_URL}`],
    },
  })
);


// Middleware to set CORS headers
app.use((req, res, next) => {
  // Allow requests only from a specific domain
  res.header('Access-Control-Allow-Origin', `${process.env.SECURE_URL}`);
  // Additional CORS headers can be added as needed
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Set this header to 'true' if credentials (like cookies) are allowed
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Middleware to set security headers, including Content-Security-Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        frameAncestors: ["'self'"], // Adjust as needed
      },
    },
  })
);

// Middleware to set X-Frame-Options header
app.use((req, res, next) => {
  res.header('X-Frame-Options', 'DENY'); // or 'SAMEORIGIN' based on your needs
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: false, // Disable default CSP if not needed
  })
);

export default app;
