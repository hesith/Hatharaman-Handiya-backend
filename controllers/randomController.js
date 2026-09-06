import { getDb } from '../server.js';
import { PostStatus } from '../Enums.js';

export async function GetRandomStories(req, res) {
    try {
        const count = parseInt(req.params.count) || 10;
        const userId = req.params?.userId;

        let likedArr = [];
        let ratedArr = [];

        if (userId != undefined) {
            likedArr = await getDb().collection('likes').find({ userId: userId }).project({ _id: 0, storyId: 1 }).toArray();
            ratedArr = await getDb().collection('ratings').find({ userId: userId }).project({ _id: 0, storyId: 1, rate: 1 }).toArray();
        }

        const currTime = new Date();

        await getDb().collection('StoryCard').aggregate([
            { $match: { statusId: PostStatus.APPROVED, timestamp: { $lte: currTime } } },
            { $sample: { size: count } },
        ]).toArray()
            .then((stories) => {
                for (let s = 0; s < stories.length; s++) {
                    for (let ls = 0; ls < likedArr.length; ls++) {
                        if (stories[s]._id == likedArr[ls].storyId) {
                            stories[s].liked = true;
                            break;
                        }
                    }
                    for (let rs = 0; rs < ratedArr.length; rs++) {
                        if (stories[s]._id == ratedArr[rs].storyId) {
                            stories[s].rated = ratedArr[rs].rate;
                            break;
                        }
                    }
                }

                res.json(stories);
            }).catch((err) => {
                res.send(err);
            });
    }
    catch (e) {
        console.log(e);
    }
}
