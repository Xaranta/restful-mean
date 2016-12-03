var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    console.log("In Adduser route");
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});


/*
 * PUT to updateuser.
 */
router.put('/updateuser/:id', function(req, res) {
    
    console.log("In update user route");
    var db = req.db;
    var collection = db.get('userlist');
    var userToUpdate = req.params.id;
    console.log(userToUpdate);
    console.log(JSON.stringify(req.body));
    collection.update({ '_id' : userToUpdate }, req.body, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});


/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;

