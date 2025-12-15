/// <reference path="./types/custom.d.ts" />

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true, // Required for cookies
}));
app.use(express.json());
app.use(cookieParser());

// Add timeout middleware
app.use((req, res, next) => {
    // Set timeout to 30 seconds
    req.setTimeout(30000);
    res.setTimeout(30000);
    next();
});

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', {
        reason: reason instanceof Error ? {
            message: reason.message,
            stack: reason.stack,
            name: reason.name
        } : reason,
        promise
    });
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', {
        message: error.message,
        stack: error.stack,
        name: error.name
    });
});

// Add this to your existing error logging configuration
if (process.env.NODE_ENV !== 'production') {
    Error.stackTraceLimit = Infinity; // Show full stack traces in development
}


// Handle 404 for API routes
app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested API route does not exist'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/ping', (req: Request, res: Response) => {
    res.json({
        message: 'Pong... API is running',
        date: new Date().toISOString(),
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

const isDev = process.env.DEV === 'true';
console.log('isDev', isDev);
if (isDev) {

    const originalConsoleLog = console.log;
    console.log = function () {
        const error = new Error();
        const caller_line = error.stack?.split("\n")[2];
        const match = caller_line?.match(/\((.+):(\d+):\d+\)?$/);
        const file = match?.[1]?.split('/').pop() || 'unknown';
        const line_number = match?.[2] || 'unknown';
        originalConsoleLog.apply(console, [`[${file}:${line_number}]`, ...arguments]);
    };
    // Then proxy all other routes to Vue
    app.use('/', createProxyMiddleware({
        target: 'http://localhost:5173',
        changeOrigin: true,
        ws: true
    }));
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        const isDevelopment = process.env.NODE_ENV !== 'production';

        console.error('Unhandled error:', {
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            request: {
                path: req.path,
                method: req.method,
                body: isDevelopment ? req.body : undefined,
                headers: {
                    'user-agent': req.get('user-agent'),
                    'x-forwarded-for': req.get('x-forwarded-for')
                }
            }
        });

        res.status(500).json({
            message: isDevelopment ? error.message : 'Internal server error',
            stack: isDevelopment ? error.stack : undefined
        });
    });

} else {
    // Server is in production
    // Serve static files from the static directory
    app.use(express.static(path.join(__dirname, '../static')));

    // Instead of proxying to Vue dev server, serve the index.html for all non-API routes
    app.use((req: Request, res: Response, next: NextFunction) => {
        // Don't serve index.html for API routes
        if (req.path.startsWith('/api')) {
            return next();
        }

        res.sendFile(path.join(__dirname, '../static/index.html'));
    });

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        console.error('Unhandled error:', {
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            request: {
                path: req.path,
                method: req.method,
                // Be careful with logging potentially sensitive headers
                headers: {
                    'user-agent': req.get('user-agent'),
                    'x-forwarded-for': req.get('x-forwarded-for')
                }
            }
        });

        res.status(500).json({ message: 'Internal server error' });
    });

}

// Example logging configuration
const logLevel = process.env.LOG_LEVEL || 'info';

// Override console.log if not in development
if (process.env.NODE_ENV === 'production') {
    console.log = logLevel === 'debug' ? console.log : () => { };
    console.info = logLevel === 'info' ? console.info : () => { };
    // Keep warning and error logs
    // console.warn and console.error remain unchanged
}
