import {getDb} from '../server.js'; 
import { PostStatus } from '../Enums.js';

export async function GetTopRatedStories(req, res) { 
    try
    {
        const limit = 99;
        let likedArr=[];
        let ratedArr=[];

        if(req.params.userId!=undefined)
        {
            let userId = req.params.userId;
            likedArr = await getDb().collection('likes').find({userId:userId}).project({_id:0,storyId:1}).toArray();
            ratedArr = await getDb().collection('ratings').find({userId:userId}).project({_id:0,storyId:1,rate:1}).toArray();
        }

        await getDb().collection('StoryCard').find({statusId: PostStatus.APPROVED, totalLikes: { $gt: 9 }}).project({timestamp:0}).sort({avgRatings:'-1'}).limit(limit).toArray()
        .then((stories) => {

                    for(let s= 0; s<stories.length ; s++){
                        if(likedArr.length>0){
                            for(let ls= 0; ls<likedArr.length ; ls++)
                                {
                                    if(stories[s]._id==likedArr[ls].storyId){
                                        stories[s].liked = true;
                                        break;
                                    }
                                }
                        }
                        
                        if(ratedArr.length>0){
                            for(let rs= 0; rs<ratedArr.length ; rs++)
                                {
                                    if(stories[s]._id==ratedArr[rs].storyId){
                                        stories[s].rated = ratedArr[rs].rate;
                                        break;
                                    }
                                }
                        }        
                    }

            res.json(stories);
        }).catch((err) => {
            res.send(err); 
        });
    }
    catch(e){
        console.log(e);
    } 
}



