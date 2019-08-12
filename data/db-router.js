const express = require('express')
const db = require('./db.js')
const router = express.Router()

// ADD POST 
router.post('/', async (req, res) => {
    try {
        const blog = req.body
        if (blog.title && blog.contents) {
            await db.insert(blog)
            res.status(201).json(blog)
        } else {
            res.status(400).json({
                message: 'title and contents are both required'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'there was an error while save the post to the database'
        })
    }
})

// ADD COMMENT
router.post('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params
        const comment = await db.findById(id)
        if (comment.length < 1) {
            res.status(404).json({
                message: 'the post with the specified id does not exist'
            })
        } else if (!req.body.text) {
            res.status(400).json({
                errorMessage: 'Please provide text for the comment'
            })
        } else {
            await db.insertComment(req.body)
            res.status(201).json(req.body.text)
        }
    } catch (error) {
        res.status(500).json({
            error: 'there was an error saving the comment to the database'
        })
    }
})

// GET ALL POSTS
router.get('/', async (req, res) => {
    try {
        const posts = await db.find(req.query)
        res.status(200).json(posts)
    } catch {
        res.status(500).json({
            error: 'the posts information could not be retrieved'
        })
    }
})

//GET POST BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const blog = await db.findById(id)

        if ((blog.length < 1)) {
            res.status(404).json({
                message: 'the post with the specified id does not exist'
            })
        } else {
            res.status(200).json(blog)
        }
    } catch (error) {
        res.status(500).json({
            error: 'the post information could not be retrieved'
        })
    }
})

// GET POSTS COMMENTS
router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params
        const blog = await db.findById(id)

        if ((blog.length < 1)) {
            res.status(404).json({
                message: 'the post with the specified id does not exist'
            })
        } else {
            res.status(200).json(blog)
        }
    } catch (error) {
        res.status(500).json({
            error: 'the comments information could not be retrieved'
        })
    }
}) 

// DELETE POST
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const post = db.findById(id)

        if (post.length < 1) {
            res.status(404).json({
                message: 'the post with the specified id does not exist'
            })
        } else {
            await db.remove(id)
            res.status(201).json({
                message: 'post removed'
            })
        }
    } catch (error) {
        res.status(500).json({
            error: 'the post could not be removed'
        })
    }
})

// EDIT POST
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body
        const post = await db.findById(id)

        if (post.length < 1) {
            res.status(404).json({
                message: 'the post with the specified id does not exist'
            })
        } else if (!updates.title || !updates.content) {
            res.status(500).json({
                errorMessage: 'please provide title and contents for the post'
            })
        } else {
            await db.update(id, updates)
            res.status(200).json(updates)
        }
    } catch (error) {
        res.status(500).json({
            error: 'the post information could not be modified'
        })
    }
})

modules.exports = router