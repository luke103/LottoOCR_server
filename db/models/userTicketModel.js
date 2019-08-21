let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let TicketSchema = new Schema({
    date :Date,
    type :String,
    result :[Number],
    user_id : String
});

let TicketModel = mongoose.model('Ticket', TicketSchema );

module.exports = TicketModel;