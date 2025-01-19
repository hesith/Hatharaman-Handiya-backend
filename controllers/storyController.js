import Story from '../models/storyModel.js';

export async function getStories(req, res) { 
    await Story.find()
    .then((stories) => {
        res.json(stories);
    }).catch((err) => {
        res.send(err);
    });
}

export async function createStory(req, res) {
    const story = new Story(req.body);
    console.log(story);
    await story.save().then(() => {
        res.status(201).send(story);
    }).catch((err) => {
        res.status(400)
    });
}



