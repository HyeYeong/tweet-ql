import {
  ApolloServer,
  gql
} from "apollo-server"

let tweets = [{
  id: "1",
  text: "first",
}, {
  id: "2",
  text: "second",
}]

let users = [{
  id: "1",
  firstName: "lee",
  lastName: "hy"
}, {
  id: "2",
  firstName: "kim",
  lastName: "taetae"
}]

// graphQl SDL (schema definition language)
// Query って言うタイプを書くべき
//Mutationは、データを修正；削除’生成をするために使う
const typeDefs = gql `
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet]
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`

const resolvers = {
  Query: {
    allUsers() {
      return users
    },
    allTweets() {
      return tweets
    },
    tweet(root, {
      id
    }) {
      return tweets.find((tweet) => tweet.id === id)
    },
  },
  Mutation: {
    postTweet(_, {
      text,
      userId
    }) {
      const newTweet = {
        id: tweets.length + 1,
        text
      }
      tweets.push(newTweet)
      return newTweet
    },
    deleteTweet(_, {
      id
    }) {
      const tweet = tweets.find(tweet => tweet.id === id)
      if (!tweet) return false
      tweets = tweets.filter(item => item.id !== id)
      return true
    }
  },
  User: {
    fullName(root) {
      const {
        firstName,
        lastName
      } = root
      console.log("fullname called", root)
      //　ここで言うRootは、このFieldを読んでいるObjectを意味する
      return `${firstName} ${lastName}`
    }
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
