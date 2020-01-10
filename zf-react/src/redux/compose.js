function add1(str) {
    return '1' + str
}
function add2(str) {
    return '2' + str
}
function add3(str) {
    return '3' + str
}
// function compose(add3, add2, add1){
//     return function(str) {
//         return add3(add2(add1(str)))
//     }
// }
export default function compose(...fns) {
    return fns.reduce((a, b) => (...args) => a(b(...args)))
}
let composeFn = compose(add3, add2, add1)
let result = composeFn('jack')
console.log(result) // 321jack