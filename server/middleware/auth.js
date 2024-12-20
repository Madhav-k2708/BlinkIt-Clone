import jwt from 'jsonwebtoken'

const auth = async (req,res,next) => {
    try {
        // cookies for desktop version and header for mobile version
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1]
        
        if (!token) {
            return res.status(401).json({success: false, message:"Provide token"})            
        }

        const token_decode = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_KEY)

        if (!token_decode) {
            return res.status(401).json({success:false, message:"Unauthorized access"})            
        }
        req.userId = token_decode.id
        
        next()
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: true, message:"You have not login"})
                
    }
}

export default auth