import jwt from 'jsonwebtoken';

// Login Seller : api/seller/login

export const sellerLogin = async (req, res) => {
    try{
        const { email, password } = req.body;

    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('sellerToken', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days 
        });

        return res.json({ success: true ,message: 'Login successful' });
    }else{
        return res.json({ success: false, message: 'Invalid Credentials' });
    }  
    }catch(error){
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }

}


//Seller Auth : /api/seller/is-auth

export const isSellerAuth = async (req, res) =>{
    try{
            return res.json({success: true})
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


//Seller Logout : /api/seller/logout

export const sellerLogout = async (req, res) =>{
    try{
        res.cookie('sellerToken', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days 
        });
        return res.json({success: true, message: "Logged Out"})
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}



