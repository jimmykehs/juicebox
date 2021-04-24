const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");

    next();
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({ tags });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params;
    try {

        const allPosts = await getPostsByTagName(tagName);

        const posts = allPosts.filter(post => {
            return post.active || (req.user && post.author.id === req.user.id)
        })

        if(posts) {
        res.send(posts)
        }
        else {
            next({
                name: 'Tag Error',
                message: 'Could not get posts with tag name'
            })
        }
    } catch ({ name, message }) {
      next({name, message})
    }
  });

module.exports = tagsRouter