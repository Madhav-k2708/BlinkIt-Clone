import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'


const generateRefreshToken = async(userId) => {
    const token = await jwt.sign({id: userId}, process.env.JWT_REFRESH_TOKEN_KEY, {expiresIn : '7d'})
    
    const updateRefreshToken = await userModel.updateOne({_id: userId}, {refresh_token : token})
    
    return token
}

export default generateRefreshToken;