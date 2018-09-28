const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: String,
    state: String,
    devices: Array
});


const groupModel = mongoose.model('Group', groupSchema);

module.exports = groupModel;