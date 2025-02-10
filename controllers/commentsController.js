import Comments from "../models/commentModel.js";
import {getDb} from '../server.js'; 

const RESTRICTED_USERS = []

export async function ProcessComment(req, res) { 
    try
    {
        const comment = new Comments(req.body);
        
        let max_id = await getDb().collection('comments').find().sort({ _id: -1 }).limit(1).toArray();
        if(max_id[0]==undefined)
        {
            max_id = 0;
        }
        else
        {
            max_id = max_id[0]._id
        }

        comment._id = max_id+1;
        comment.timestamp = new Date();

        if(RESTRICTED_USERS.find(userId => userId==comment.userId)==undefined)
        {
            await comment.save().then(() => {
                res.status(201).send();
            }).catch(() => {
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

export async function DeleteCommentById(req, res) { 
    try
    {
        let id = parseInt(req.params.id);

        if(id==undefined)
        {
            return;
        }

        await getDb().collection('comments').deleteOne({_id: id})
        .then(() => {
            res.status().send(200);
        }).catch((err) => {
            res.send(err); 
        });
    }
    catch(e){
        console.log(e);
    } 
}

export async function GetCommentsByStoryId(req, res) { 
    try
    {
        let limit = 100;
        let id = parseInt(req.params.id);

        if(id==undefined)
        {
            return;
        }

        await getDb().collection('Comments').find({storyId: id}).limit(limit).toArray()
        .then((comments) => {
            res.send(comments);
        }).catch((err) => {
            res.send(err); 
        });
    }
    catch(e){
        console.log(e);
    } 
}



