const jwt = require('jsonwebtoken');
const secretcode = process.env.JWT_SECRET || 'defaultSecret'; 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secretcode);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token Error:', err); 
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;