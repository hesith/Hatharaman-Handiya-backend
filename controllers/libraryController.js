import { getDb } from '../server.js';
import { PostStatus } from '../Enums.js';

export async function GetLibraryStories(req, res) {
    try {
        const userId = req.params?.userId;

        if (userId == undefined) {
            return res.json([]);
        }

        const likedArr = await getDb().collection('likes').find({ userId: userId }).project({ _id: 0, storyId: 1 }).toArray();
        const ratedArr = await getDb().collection('ratings').find({ userId: userId }).project({ _id: 0, storyId: 1, rate: 1 }).toArray();

        const idSet = new Set([...likedArr.map((l) => l.storyId), ...ratedArr.map((r) => r.storyId)]);
        const ids = Array.from(idSet);

        if (ids.length === 0) {
            return res.json([]);
        }

        await getDb().collection('StoryCard').find({ _id: { $in: ids }, statusId: PostStatus.APPROVED }).sort({ timestamp: -1 }).limit(200).toArray()
            .then((stories) => {
                for (let s = 0; s < stories.length; s++) {
                    if (likedArr.find((l) => l.storyId == stories[s]._id)) {
                        stories[s].liked = true;
                    }

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
