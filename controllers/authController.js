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

            const user = new User({
                _id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture
            });

            await user.replaceOne( user, {upsert: true}).then(() => {
                res.status(201).send(story);
            }).catch((err) => {
                res.status(400)
            });   
    })
    .catch((err) => {    
        console.log(err); 
        res.status(401).json({message: "Authentication unsuccessful", error: err}).send();  
    });
 
}



