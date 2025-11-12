// middleware/security.js - Рабочая версия
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// ============ SQL INJECTION PROTECTION ============
const sqlInjectionProtection = (req, res, next) => {
    const sanitize = (input) => {
        if (typeof input === 'string') {
            return input
                .replace(/['"`;\\]/g, '') // Remove quotes, semicolons, backslashes
                .replace(/(\s*(or|and|union|select|insert|update|delete|drop|create|alter|exec|execute)\s*)/gi, ''); // Remove SQL keywords
        }
        return input;
    };

    // Clean body parameters
    if (req.body && typeof req.body === 'object') {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitize(req.body[key]);
            }
        }
    }

    // Clean query parameters
    if (req.query && typeof req.query === 'object') {
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitize(req.query[key]);
            }
        }
    }

    // Clean URL parameters
    if (req.params && typeof req.params === 'object') {
        for (const key in req.params) {
            if (typeof req.params[key] === 'string') {
                req.params[key] = sanitize(req.params[key]);
            }
        }
    }

    next();
};

// ============ XSS PROTECTION ============
const xssProtection = (req, res, next) => {
    const cleanXSS = (str) => {
        if (typeof str !== 'string') return str;
        
        return str
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
    };

    // Clean body
    if (req.body && typeof req.body === 'object') {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = cleanXSS(req.body[key]);
            }
        }
    }

    // Clean query
    if (req.query && typeof req.query === 'object') {
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = cleanXSS(req.query[key]);
            }
        }
    }

    next();
};

// ============ PATH TRAVERSAL PROTECTION ============
const pathTraversalProtection = (req, res, next) => {
    const suspiciousPaths = [
        '../', '..\\', './', '.\\',
        '/etc/', '/proc/', '/sys/', '/root/', '/home/',
        'package.json', '.env', 'server.js', 'config/',
        'node_modules/', '.git/', '.ssh/'
    ];

    const fullUrl = req.originalUrl || req.url;
    const decodedUrl = decodeURIComponent(fullUrl);

    for (const suspiciousPath of suspiciousPaths) {
        if (decodedUrl.toLowerCase().includes(suspiciousPath.toLowerCase())) {
            console.log(`🚨 Path traversal blocked: ${decodedUrl} from IP: ${req.ip}`);
            return res.status(403).json({ error: 'Access denied' });
        }
    }

    // Block system file extensions
    const blockedExtensions = ['.js', '.json', '.env', '.config', '.ini', '.conf'];
    const pathLower = decodedUrl.toLowerCase();
    
    for (const ext of blockedExtensions) {
        if (pathLower.endsWith(ext) && !pathLower.startsWith('/uploads/')) {
            console.log(`🚨 System file access blocked: ${decodedUrl} from IP: ${req.ip}`);
            return res.status(403).json({ error: 'Access denied' });
        }
    }

    next();
};

// ============ RATE LIMITING ============
const rateLimitGeneral = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const rateLimitAuth = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per 15 minutes
    message: {
        error: 'Too many login attempts, please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip + ':' + (req.body.username || req.body.email || 'unknown');
    }
});

// ============ SECURITY HEADERS ============
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "blob:", "http://localhost:*"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", "http://localhost:*"]
        },
    },
    hidePoweredBy: true,
});

// ============ ERROR HANDLER ============
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);

    const isDevelopment = process.env.NODE_ENV === 'development';

    // Hide database errors
    if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ER_BAD_DB_ERROR') {
        return res.status(500).json({ error: 'Database connection error' });
    }

    if (err.message && err.message.includes('SQL')) {
        return res.status(500).json({ error: 'Database error' });
    }

    res.status(err.status || 500).json({
        error: isDevelopment ? err.message : 'Internal server error'
    });
};

// ============ EXPORTS ============
module.exports = {
    sqlInjectionProtection,
    xssProtection,
    pathTraversalProtection,
    rateLimitGeneral,
    rateLimitAuth,
    securityHeaders,
    errorHandler
};