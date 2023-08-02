import {
  ApolloServer,
  gql
} from "apollo-server"

let tweets = [{
  id: "1",
  text: "first",
  userId: "2"
}, {
  id: "2",
  text: "second",
  userId: "1"
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
    """
    is sum firstName + lastName as a string
    """
    fullName: String!
  }
  """
  Tweet obj represents a resource for A Tweet ->주석 달기
  """
  type Tweet {
    id: ID
    text: String!
    userId: String!
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
        text,
        userId
      }
      if (!userId) return console.error("유저 ID가 존재하지 않습니다.")
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
    fullName({
      firstName,
      lastName
    }) {
      //　ここで言うRootは、このFieldを読んでいるObjectを意味する
      return `${firstName} ${lastName}`
    }
  },
  Tweet: {
    author({
      userId
    }) {
      if (!userId) return console.error("유저 ID가 존재하지 않습니다.")
      return users.find(user => user.id === userId)
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
