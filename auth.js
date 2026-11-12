const jwt = require('jsonwebtoken');
const SECRET = 'your-secret-key';

function generateToken(userId) {
    return jwt.sign({ userId }, SECRET, { expiresIn: '1d' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
}

module.exports = { generateToken, verifyToken };