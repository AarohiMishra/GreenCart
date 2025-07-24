import jwt from 'jsonwebtoken';

const authSeller = (req, res, next) => {
    const {sellerToken} = req.cookies;
    if (!sellerToken) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const tokenDecoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
        if (tokenDecoded.email === process.env.SELLER_EMAIL) {
            req.seller = tokenDecoded; 
            next();
        } else {
            return res.json({message: 'Not Authorized'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export default authSeller;