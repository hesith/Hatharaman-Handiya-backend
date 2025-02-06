import {getDb} from '../server.js'; 
import { PostStatus } from '../Enums.js';

export async function GetTopRatedStories(req, res) { 
    try
    {
        const limit = 99;

        await getDb().collection('StoryCard').find({statusId: PostStatus.APPROVED}).project({timestamp:0}).sort({avgRatings:'-1'}).limit(limit).toArray()
        .then((stories) => {
            res.json(stories);
        }).catch((err) => {
            res.send(err); 
        });
    }
    catch(e){
        console.log(e);
    } 
}



