const mongoose = require('mongoose');
const TodoSchema = mongoose.Schema({
        value: {
            type: String,
            required: true
        },
        data: {
            type: Date,
            required: true
        }
});

module.exports = mongoose.model('todo', TodoSchema);