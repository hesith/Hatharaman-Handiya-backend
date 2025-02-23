import Story from '../models/storyModel.js';
import {getDb} from '../server.js'; 
import { PostStatus } from '../Enums.js';

const RESTRICTED_USERS = []

const ADMINISTRATOR_USERS = ["113241915717330144410"]

export async function GetStories(req, res) { 
    try
    {
        const limit = 30;
        let pageNo = 1;
        let likedArr=[];
        let ratedArr=[];

        if(req.params.pageNo!=undefined)
        {
            pageNo = parseInt(req.params.pageNo)
        }

        if(req.params.userId!=undefined)
        {
            let userId = req.params.userId;
            likedArr = await getDb().collection('likes').find({userId:userId}).project({_id:0,storyId:1}).toArray();
            ratedArr = await getDb().collection('ratings').find({userId:userId}).project({_id:0,storyId:1,rate:1}).toArray();
        }

        let pageCount = Math.ceil((await getDb().collection('StoryCard').countDocuments({statusId: PostStatus.APPROVED}))/limit)


        await getDb().collection('StoryCard').find({statusId: PostStatus.APPROVED}).skip((pageNo-1)*limit).limit(limit).toArray()
        .then((stories) => {

                    let currTime = new Date();
                    stories = stories.filter(story=> currTime > story.timestamp);

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

            stories.sort();

            let result = {"pageCount": pageCount, "stories": stories}
            res.json(result);
        }).catch((err) => {
            res.send(err); 
        });
    }
    catch(e){
        console.log(e);
    } 
}

export async function GetStoryById(req, res) { 
    try
    {
        let id = parseInt(req.params.id);

        if(id==undefined)
        {
            return;
        }

        await getDb().collection('Story').findOne({_id: id})
        .then((story) => {
            res.json(story);
        }).catch((err) => {
            res.send(err); 
        });
    }
    catch(e){
        console.log(e);
    } 
}

export async function GetMyPosts(req, res) { 
    try
    {
        const limit = 30;
        let pageNo = 1;


        if(req.params.userId==undefined) {return};
        
        let id = req.params?.userId;

        if(req.params.pageNo!=undefined)
        {
            pageNo = parseInt(req.params.pageNo)
        }


        if(ADMINISTRATOR_USERS.find(userId => userId==id)==undefined)
        {
            let pageCount = Math.ceil((await getDb().collection('StoryCard').countDocuments({userId: id}))/limit)

            await getDb().collection('StoryCard').find({userId: id}).skip((pageNo-1)*limit).limit(limit).toArray()
            .then((stories) => {
                stories.sort()
                let result = {"pageCount": pageCount, "stories": stories}
                res.json(result);
            }).catch((err) => {
                res.send(err); 
            });
        }
        else
        {
            let pageCount = Math.ceil((await getDb().collection('StoryCard').countDocuments())/limit)

            await getDb().collection('StoryCard').find().skip((pageNo-1)*limit).limit(limit).toArray()
            .then((stories) => {
                stories.sort()
                let result = {"pageCount": pageCount, "stories": stories}
                res.json(result);
            }).catch((err) => {
                res.send(err); 
            });
        }

    }
    catch(e){
        console.log(e);
    } 
}

export async function DeleteMyPostById(req, res) { 
    try
    {
        if(req.params.userId==undefined || req.params.storyId==undefined) {return};

        let userId = req.params?.userId;
        let storyId = parseInt(req.params?.storyId);
        
        await getDb().collection('stories').deleteOne({_id: storyId, userId:userId})
        .then((result) => {
            if(result.deletedCount>0)
            {
                getDb().collection('likes').deleteMany({storyId: storyId})
                getDb().collection('total_likes').deleteOne({_id: storyId})
                getDb().collection('ratings').deleteMany({storyId: storyId})
                getDb().collection('total_ratings').deleteOne({_id: storyId})
                getDb().collection('comments').deleteMany({storyId: storyId})
            }

            res.status().send(200);

        }).catch((err) => {
            res.send(err); 
        });
    }
    catch(e){
        console.log(e);
    } 
}

export async function ChangePostStatusById(req, res) { 
    try
    {
        if(req.params.userId==undefined || req.params.storyId==undefined || req.params.statusId==undefined) {return};

        let privUserId = req.params?.userId;
        let storyId = parseInt(req.params?.storyId);
        let statusId = parseInt(req.params?.statusId);

        if(ADMINISTRATOR_USERS.find(userId => userId==privUserId)!=undefined){
            await getDb().collection('stories').updateOne({_id: storyId}, { $set: { statusId: statusId } })
            .then(() => {
                res.status().send(200);

            }).catch((err) => {
                res.send(err); 
            });
        }
        else
        {
            res.status().send(401);
        }
    }
    catch(e){
        console.log(e);
    } 
}

export async function CreateStory(req, res) {
    try
    {
        const story = new Story(req.body.data);


        if(req.body.id!=null)
        {
            story._id = req.body.id;
        }   
        else
        {
            let max_id = await getDb().collection('stories').find().sort({ _id: -1 }).limit(1).toArray();

            if(max_id==undefined)
            {
                max_id = 0;
            }
            else
            {
                max_id = max_id[0]._id
            }

            story._id = max_id+1;
        }

        story.timestamp = new Date();
        story.statusId = PostStatus.PENDING;

        if(RESTRICTED_USERS.find(userId => userId==story.userId)==undefined){
            await story.replaceOne( story, {upsert: true}).then(() => {
                res.status(201).send(story);
            }).catch((err) => {
                res.status(400).send();
            });
        }
        else
        {
            res.status(403).send();
        }
    }
    catch(e)
    {
        console.log(e);
    } 
}

export async function CreateDraft(req, res) {
    try
    {
        const story = new Story(req.body.data);

        if(req.body.id!=null)
        {
            story._id = req.body.id;
        }   
        else
        {
            let max_id = await getDb().collection('stories').find().sort({ _id: -1 }).limit(1).toArray();

            if(max_id==undefined)
            {
                max_id = 0;
            }
            else
            {
                max_id = max_id[0]._id
            }

            story._id = max_id+1;
        }

        story.timestamp = new Date();
        story.statusId = PostStatus.DRAFT;
             
        if(RESTRICTED_USERS.find(userId => userId==story.userId)==undefined){
            await story.replaceOne( story, {upsert: true}).then(() => {
                res.status(201).send(story);
            }).catch((err) => {
                res.status(400)
            });
        }
        else
        {
            res.status(403).send();
        }
    }
    catch(e)
    {
        console.log(e);
    } 
}



