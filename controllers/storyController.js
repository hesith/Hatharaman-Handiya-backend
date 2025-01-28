import Story from '../models/storyModel.js';
import {getDb} from '../server.js'; 

export async function GetStories(req, res) { 
    try
    {
        const limit = 5;
        let pageNo = 1;

        if(req.params.pageNo!=undefined)
        {
            pageNo = parseInt(req.params.pageNo)
        }

        await getDb().collection('StoryCard').find().skip((pageNo-1)*limit).limit(limit).toArray()
        .then((stories) => {
            console.log(stories)
            res.json(stories);
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
        story.timestamp = new Date();

        story.statusId = 0;
                
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



