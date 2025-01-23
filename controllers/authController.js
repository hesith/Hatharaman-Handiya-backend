import { OAuth2Client } from "google-auth-library";
import User from "../models/userGoogModel.js";

const client = new OAuth2Client();

export async function VerifyGoogleAuthIdToken(req, res) { 
    let token = (req.headers['authorization']).split(' ')[1];

    await client.verifyIdToken({
        idToken: token,
        audience: [
            process.env.GOOGLE_AUTH_ANDROID_CLIENT_ID, 
            process.env.GOOGLE_AUTH_WEB_CLIENT_ID
        ] 
    })
    .then(async(success)=> {
        let payload = success.getPayload();
        let userInDB = await User.findOne({email: payload.email}); 

        if(userInDB == null) { 
            const user = new User({
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture
            });
            await user.save().then(() => {
                console.log("New user saved to DB", user);
            }).catch((err) => {
                console.log(err);
            });
        }
        res.status(200).json({message: "User authenticated successfully"}).send();  
    })
    .catch((err) => {    
        console.log(err); 
        res.status(401).json({message: "Authentication unsuccessful", error: err}).send();  
    });
 
}



