import { getDb } from '../server.js';
import { PostStatus } from '../Enums.js';

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function DiscoverStories(req, res) {
    try {
        const limit = 20;
        let pageNo = 1;
        const userId = req.params?.userId;
        const q = typeof req.query?.q === 'string' ? req.query.q.trim() : '';

        if (req.params.pageNo != undefined) {
            pageNo = parseInt(req.params.pageNo);
        }

        let likedArr = [];
        let ratedArr = [];

        if (userId != undefined) {
            likedArr = await getDb().collection('likes').find({ userId: userId }).project({ _id: 0, storyId: 1 }).toArray();
            ratedArr = await getDb().collection('ratings').find({ userId: userId }).project({ _id: 0, storyId: 1, rate: 1 }).toArray();
        }

        const query = { statusId: PostStatus.APPROVED };
        if (q.length > 0) {
            query.title = { $regex: escapeRegex(q), $options: 'i' };
        }

        let pageCount = Math.ceil((await getDb().collection('StoryCard').countDocuments(query)) / limit);

        await getDb().collection('StoryCard').find(query).sort({ timestamp: -1 }).skip((pageNo - 1) * limit).limit(limit).toArray()
            .then((stories) => {
                const currTime = new Date();
                stories = stories.filter((story) => currTime > story.timestamp);

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

                res.json({ pageCount, stories });
            }).catch((err) => {
                res.send(err);
            });
    }
    catch (e) {
        console.log(e);
    }
}
