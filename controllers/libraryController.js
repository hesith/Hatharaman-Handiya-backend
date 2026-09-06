import { getDb } from '../server.js';
import { PostStatus } from '../Enums.js';

export async function GetLibraryStories(req, res) {
    try {
        const userId = req.params?.userId;

        if (userId == undefined) {
            return res.json([]);
        }

        const likedArr = await getDb().collection('likes').find({ userId: userId }).project({ _id: 0, storyId: 1 }).toArray();

        const ids = likedArr.map((l) => l.storyId);

        if (ids.length === 0) {
            return res.json([]);
        }

        const ratedArr = await getDb().collection('ratings').find({ userId: userId, storyId: { $in: ids } }).project({ _id: 0, storyId: 1, rate: 1 }).toArray();

        await getDb().collection('StoryCard').find({ _id: { $in: ids }, statusId: PostStatus.APPROVED }).sort({ timestamp: -1 }).limit(200).toArray()
            .then((stories) => {
                for (let s = 0; s < stories.length; s++) {
                    stories[s].liked = true;

                    const rating = ratedArr.find((r) => r.storyId == stories[s]._id);
                    if (rating) {
                        stories[s].rated = rating.rate;
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
