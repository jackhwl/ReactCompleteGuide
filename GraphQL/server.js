const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
let schema = require('./schema')
const app = express();
app.use(cors({
    origin: 'http://localhost:3000', //allow which client could cross domain
    methods: 'GET,PUT,POST,DELETE,OPTIONS'
}))
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true //query tools
}))
app.listen(4000, () => {
    console.log('server started on port: 4000')
})