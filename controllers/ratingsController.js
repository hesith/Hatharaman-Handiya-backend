import Ratings from "../models/ratingModel.js";

export async function ProcessRating(req, res) { 
    try
    {
        const ratings = new Ratings(req.body);

        let compositeKey = ratings.storyId.toString() +ratings.userId;

        ratings._id = compositeKey
             

        await ratings.replaceOne(ratings, {upsert: true}).then(() => {
            res.status(201).send(); 
        }).catch(() => {
            res.status(400)
        });
        

    }
    catch(e)
    {
        console.log(e);
    } 
}



