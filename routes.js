var express = require("express");
var router = express.Router();
var Note = require("./models/note.js");
// GET: without AJAX
router.get("/", function(req, res, next){
  Note.find({}, function(err, allNotes){
    if(err){
      console.log(err)
    }else{
      res.render("./index", {notes: allNotes})
    }
  }).limit(14).sort({createdAt: -1})

})

router.get("/new", function(req, res, next){
      res.render("./new")
})



//GET: for AJAX call
router.get("/notes", function(req, res, next){
  Note.find({}, function(err, allNotes){
    if(err){
      console.log(err)
    }else{
      res.json(allNotes)
    }
  }).sort({createdAt: -1})
})

//GET next batch: for AJAX call
router.get("/getMore", function(req, res, next){
  var alreadyPosted = parseInt(req.query.noteCount)
  console.log('number already posted is ', alreadyPosted)
  Note.find({}, function(err, allNotes){
    if(err){
      console.log(err)
    }else{
      res.json(allNotes)
    }
  }).skip(alreadyPosted).limit(5).sort({createdAt: -1})

})

// 5c4fccd365e25626c9ac1d5a is first id when skipping

//POST Comment AJAX way
router.post("/new", function(req, res, next){
  var title = req.body.title
  var note = req.body.note
  var post = new Note({title: title, note: note})
  post.save(function(err, note){
    if(err) return next(err);
    res.status(201);
    res.send(note)
    // res.send(
    //   (err === null) ? {msg: ''} : {msg: err}
    // )
  });
});

//UPDATE Note (by clicking in-focus close button)
router.put("/put", function(req, res){
  var id = req.body.noteID
  var data = {title: req.body.title, note: req.body.note}
  console.log('we just hit the put route!')
  console.log(req.body.title, req.body.note)
  Note.findOneAndUpdate({_id: id}, data).then(function(newNote){
    res.send(newNote)
  }).catch( function(err){
    console.log(err)
  })
})

//DELETE Note (via delete button)
router.delete("/:id", function(req, res, next){
  Note.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err)
      // don't want to redirect, remove note in ajax function
      // res.redirect("/")
      res.send(err)
    }else{
      // res.redirect("/")
      res.send("deleted note")
    }
  })
})



module.exports = router;
