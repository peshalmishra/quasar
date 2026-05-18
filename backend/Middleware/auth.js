import jwt from 'jsonwebtoken';

export const authenticationToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Internal server error: JWT secret not configured" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(401).json({message:"Invalid token"});
            req.user = user; 
            next();
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
