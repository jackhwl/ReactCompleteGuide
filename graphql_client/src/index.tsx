import React from 'react';
import ReactDOM from 'react-dom';
//AppolloClient is an tools live in browser query graphql interface
import ApolloClient from 'apollo-boost'
import { gql } from 'apollo-boost'
const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql'
})
client.query({
    query: gql`
        query{
            getCategories{
                id,
                name
            }
        }
    `
}).then(result => console.log(result))