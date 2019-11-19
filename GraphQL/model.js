let mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId
const Scheme = mongoose.Schema
mongoose.createConnection('mongodb://localhost/graphql')