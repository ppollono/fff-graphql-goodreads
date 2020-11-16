const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: '...',

    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: xml => 
                xml.title[0]
        },
        isbn: {
            type: GraphQLString,
            resolve: xml => 
                xml.isbn[0]
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '...',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: xml => xml.GoodreadsResponse.author[0].name[0]
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: xml => {
                return xml.GoodreadsResponse.author[0].books[0].book
            }
        }
    })
})


module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',

        fields: () => ({
            author: {
                type: AuthorType,
                args: {
                    id: {
                        type: GraphQLInt
                    }
                },
                resolve: (parent, args) =>  fetch(`https://www.goodreads.com/author/show.xml?id=${args.id}&key=V73hwaQjsE8x2VopbKgtw`)
                    .then(response => response.text())
                    .then(parseXML)
            }
        })
    })
})