const graphql = require('graphql')
const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLNonNull, GraphQLList  } = graphql;
const categories = [
    { id: '1', name: 'Book'},
    { id: '2', name: 'Digital'},
    { id: '3', name: 'Food'}
]
const products = [
    { id: '1', name: '红楼梦', category: '1'},
    { id: '2', name: '西游记', category: '1'},
    { id: '3', name: '三国演义', category: '1'},
    { id: '4', name: '水浒传', category: '1'},
    { id: '5', name: 'iPhone', category: '2'},
    { id: '6', name: 'Bread', category: '3'}
]
// define product's category
const Category = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        products: {
            type: new GraphQLList(Product),
            resolve(parent){
                return products.filter(item=>item.category === parent.id)
            }
        }
    })
})
const Product = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        category: { //string convert to object  1=> {nmae:'image'}
            type: Category,
            resolve(parent) {
                return categories.find(item=>item.id===parent.category)
            }
        }
    })
})
// define root type
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getCategory: { // search every category base on category's id
            type: Category,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) { // {id: '1'}
                return categories.find((item) => item.id === args.id )
            }
        },
        getCategories: { //query categories
            type: new GraphQLList(Category),
            args: {},
            resolve(parent, args) { // {id: '1'}
                return categories
            }
        },
        getProduct: {
            type: Product,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) { // {id: '1'}
                return products.find((item) => item.id === args.id )
            }
        },        
        getProducts: { //query products
            type: new GraphQLList(Product),
            args: {},
            resolve(parent, args) { // {id: '1'}
                return products
            }
        },
    }
})
const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        addCategory: {
            type: Category,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)} 
            },
            resolve(parent, args) { // {name: 'xxx'}
                args.id = categories.length + 1
                categories.push(args)
                return args
            }
        },
        addProduct: {
            type: Product,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)} 
            },
            resolve(parent, args) { // {name: 'xxx'}
                args.id = products.length + 1
                products.push(args)
                return args
            }
        }
    }
})
// define schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})