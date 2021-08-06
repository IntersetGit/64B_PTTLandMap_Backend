const jwt = require('jsonwebtoken');
const config = require('../config');

exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) res.sendStatus(401)
    jwt.verify(token, config.JWT_SECRET ?? "", async (err, model) => {
        if (err) res.sendStatus(403)
        req.model = model
        next()
    })

}
