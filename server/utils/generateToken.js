import jwt from 'jsonwebtoken'


const generateAccessToken = async (userId) => {
    const token = await jwt.sign({id: userId}, process.env.JWT_ACCESS_TOKEN_KEY, {expiresIn : '5h'})

    return token;
}

export default generateAccessToken