import {
  ApolloServer,
  gql
} from "apollo-server"

// graphQl SDL (schema definition language)
// Query って言うタイプを書くべき
const typeDefs = gql `
  type User {
    id: ID
    username: String 
  }
  type Tweet {
    id: ID
    text: String
    author: User
  }
  type Query { 
    allTweets: [Tweet]
    tweet(id: ID): Tweet
  }
`

const server = new ApolloServer({
  typeDefs
})
server.listen().then(({
  url
}) => {
  console.log(`running on ${url}`)
})
// rest APIは多いURLの集まり、
// GraphQlはTypeの集まり
