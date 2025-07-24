import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Register User : /api/users/register
export const register = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'});
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.json({success: false, message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', //Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration time (7 days)
        });

        return res.json({ success: true, user: {email: user.email, name: user.name} });
    }catch(error){
        console.error("Error in registerUser:", error.message);
        res.json({success: false, message: error.message});
    }
}

//Login User : /api/users/login

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.json({success: false, message: 'Email and Password are required'});
        }

        const user = await User.findOne({ email });

        if(!user){
            return res.json({success: false, message: 'Invalid Email or Password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success: false, message: 'Invalid Email or Password'});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, user: { email: user.email, name: user.name } });
    }catch(error){
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


//Check Authenticated User : /api/users/auth
export const isAuth = async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await User.findById(userId).select('-password');
        return res.json({ success: true, user });
    } catch (error) {
        console.error("Error in isAuth:", error.message);
        return res.json({ success: false, message: error.message });
    }
}


//Logout User : /api/users/logout
export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict'
        });
        return res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error("Error in logout:", error.message);
        return res.json({ success: false, message: error.message });
    }
}


