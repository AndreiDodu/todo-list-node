const express = require('express');
const Todo = require("../models/Todo");

const router = express.Router();

router.get("/", (req, res) => {
    Todo.find().then(data => {
        res.json(data);
    }).catch(e => {
        res.json({ message: e });
    });
});
/*
router.get("/:id", (req, res) => {
    Todo.findById(req.params.id).then(data => {
        res.json(data);
    }).catch((e) => {
        res.json({ message: e });
    });
});
*/
router.post("/", (req, res) => {
    console.log('BODY', req.body, res.body);
    const data = new Todo({
        value: req.body.value,
        data: new Date()
    });

    data.save().then(todo => {
        res.json(todo);
    }).catch((e) => {
        res.json({ message: e });
    });
});

router.delete("/:id", (req, res) => {
    Todo.remove({_id: req.params.id}).then((data) => {
        res.json(data);
    }).catch((e) => {
        res.json({ message: e });
    });
});
/*
router.put("/:id", (req, res) => {
    Todo.updateOne({ _id: req.params.id }, { $set: { value: req.body.value } }).then(data => {
        res.json(data);
    }).catch(e => {
        res.json({ message: e });
    });
});
*/

module.exports = router;