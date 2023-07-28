import {
  ApolloServer,
  gql
} from "apollo-server"

const tweets = [{
  id: "1",
  text: "first",
}, {
  id: "2",
  text: "second",
}]

// graphQl SDL (schema definition language)
// Query って言うタイプを書くべき
//Mutationは、データを修正；削除’生成をするために使う
const typeDefs = gql `
  type User {
    id: ID!
    username: String !
  }
  type Tweet {
    id: ID
    text: String!
    author: User
  }
  type Query { 
    allTweets: [Tweet]
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`

const resolvers = {
  Query: {
    allTweets() {
      return tweets
    },
    tweet(root, {
      id
    }) {
      return tweets.find((tweet) => tweet.id === id)
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})
server.listen().then(({
  url
}) => {
  console.log(`running on ${url}`)
})
// rest APIは多いURLの集まり、
// GraphQlはTypeの集まり
