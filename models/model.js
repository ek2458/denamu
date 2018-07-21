var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var secreteSchema = new Schema({
	title: String,
	secrete: String,
	dateAdded : { type: Date, default: Date.now },
})

// export 'Secrete' model so we can interact with it in other files
module.exports = mongoose.model('Secretes',secreteSchema);
