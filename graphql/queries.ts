import { gql } from '@apollo/client'

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      topic
      id
      created_at
    }
  }
`

export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      body
      id
      created_at
      image
      subreddit_id
      title
      username
      subreddit {
        created_at
        id
        topic
      }
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
      comments {
        created_at
        id
        post_id
        text
        username
      }
    }
  }
`
