import Story from '../models/storyModel.js';
import {getDb} from '../server.js'; 
import { PostStatus } from '../Enums.js';

export async function GetStories(req, res) { 
    try
    {
        const limit = 30;
        let pageNo = 1;

        if(req.params.pageNo!=undefined)
        {
            pageNo = parseInt(req.params.pageNo)
        }

        let pageCount = Math.ceil((await getDb().collection('StoryCard').countDocuments())/limit)

        await getDb().collection('StoryCard').find({statusId: PostStatus.APPROVED}).skip((pageNo-1)*limit).limit(limit).toArray()
        .then((stories) => {
            stories.sort()
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

export async function CreateStory(req, res) {
    try
    {
        const story = new Story(req.body);

        let max_id = await getDb().collection('stories').find().sort({ _id: -1 }).limit(1).toArray();

        if(max_id==undefined)
        {
            max_id = 0;
        }
        else{
            max_id = max_id[0]._id
        }

        story._id = max_id+1;
        story.timestamp = new Date();
        story.statusId = PostStatus.PENDING;
                
        await story.save().then(() => {
            res.status(201).send(story);
        }).catch((err) => {
            res.status(400)
        });
    }
    catch(e)
    {
        console.log(e);
    } 
}

export async function CreateDraft(req, res) {
    try
    {
        const story = new Story(req.body);

        let max_id = await getDb().collection('stories').find().sort({ _id: -1 }).limit(1).toArray();

        if(max_id==undefined)
        {
            max_id = 0;
        }
        else{
            max_id = max_id[0]._id
        }

        story._id = max_id+1;

        story.timestamp = new Date();

        story.statusId = PostStatus.DRAFT;
                
        await story.save().then(() => {
            res.status(201).send(story);
        }).catch((err) => {
            res.status(400)
        });
    }
    catch(e)
    {
        console.log(e);
    } 
}



