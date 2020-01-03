let pathToRegexp = require('path-to-regexp')
let params=[]
let regexp = pathToRegexp('/user', [], { end: true })
let regexp2 = pathToRegexp('/user/:id', params, { end: true})
console.log(regexp)
console.log(regexp2)