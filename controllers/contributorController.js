import {getDb} from '../server.js'; 

export async function GetContributorDetails(req, res) { 
    try
    {
        let id = req.params?.id;

        await getDb().collection('usersGoog').find({_id: id}).project({name:1,picture:1}).toArray()
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



