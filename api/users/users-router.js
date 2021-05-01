const express = require('express');
const express = require('express');
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
const router = express.Router();

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users
  .get(req.query)
  .then(users =>{
    res.status(200).json(users);
  })
  .catch(error=>{
    console.log(error);
    res.status(500).json({
      message:'error retrieving users'
    })
  })
});

router.get('/:id', (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
   // do your magic!
   Users
   .getById(req.params.id)
   .then(user=>{
     if(user){
       res.status(200).json(user);
     }else{
       res.status(404).json({
         message: ' user not found'
       })
     }
   })
   .catch(error=>{
     console.log(error);
     res.status(500).json({
       message: 'error with db'
     })
   })
});

router.post('/', validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users
  .insert(req.body)
  .then(user =>{
    res.status(200).json(user);
  })
  .catch(error=>{
    console.log(error);
    res.status(500).json({
      message: 'error adding the user'
    })
  })
});

router.put('/:id', validateUserId,validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users
  .update(req.params.id, req.body)
  .then(user=>{
    if(user){
      res.status(200).json(user);
    }else{
      res.status(400).json({
        message: 'user cant be found'
      })
    }
  })
  .catch(error=>{
    console.log(error);
    res.status(500).json({
      message: 'error with db'
    })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const id = req.params.id
  Users
  .remove(id)
  .then(user =>{
    res.status(200).json({
      message: 'user deleted'
    })
  })
  .catch(error=>{
    console.log(error);
    res.status(500).json({
      message: 'error with db'
    })
  })
});

router.get('/:id/posts',  validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users
  .getUserPosts(req.params.id)
  .then(msg =>{
    res.status(200).json(msg)
  })
.catch(error=>{
console.log(error);
res.status(500).json({
  message:'error getting users post'
})
})
});


router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const postInfo = {...req.body, user_id: req.params.id};
  Posts(postInfo)
  .insert(req.params.id)
  .then(post =>{
    res.status(200).json(post);
  })
  .catch(error =>{
    console.log(error);
    res.status(500).json({
      message: 'error getting posts from the db'
    })
  })
});









//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const {id} = req.params;
  Users
  .getById(id)
  .then(user=>{
    if(user){
      req.user = user;
      next();
    }else{
      res.status(404).json({
        message: 'no user id found'
      })
    }
  })
  .catch(error=>{
    console.log(error);
    res.status(500).json({
      message:'error retrieving user id from db'
    })
  })
}

function validateUser(req, res, next) {
  // do your magic!

  //will validate if a name was entered in and will error if left blank
  const body = req.body;
  !body.name || body.name === {} ?
    res.status(400).json({message: 'Please include your name'})
    : next();
}

function validatePost(req, res, next) {
  // do your magic!
  const body = req.body;
  if(!body){
    res.status(400).json({
      message: 'misssing post'
    }) 
  } else if (!body.text){
      res.status(400).json({
        message: 'missing text for post msg'
      })
  }else{
    next();
  }
}

module.exports = router;