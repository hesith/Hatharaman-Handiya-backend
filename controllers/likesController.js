import Likes from "../models/likeModel.js";

export async function ProcessLike(req, res) { 
    try
    {
        const likes = new Likes(req.body);

        let compositeKey = likes.storyId.toString() +likes.userId;

        likes._id = compositeKey
             
        let existingRec = await Likes.findOne({_id:compositeKey});

        if(await existingRec == null)
        {
            await likes.save().then(() => {
                res.status(201).send();
            }).catch(() => {
                res.status(400)
            });
        }
        else
        {
            await likes.deleteOne({_id:compositeKey}).then(() => {
                res.status(200).send();
            }).catch(() => {
                res.status(400)
            });
        }

    }
    catch(e)
    {
        console.log(e);
    } 
}



