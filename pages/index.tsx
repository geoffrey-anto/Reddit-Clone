import { useQuery } from '@apollo/client'
import { Jelly } from '@uiball/loaders'
import type { NextPage } from 'next'
import Head from 'next/head'
import Feed from '../components/Feed'
import PostBox from '../components/PostBox'
import SubredditRow from '../components/SubredditRow'
import { GET_SUBREDDIT_WITH_LIMIT } from '../graphql/queries'

const Home: NextPage = () => {
  const { data } = useQuery(GET_SUBREDDIT_WITH_LIMIT, {
    variables: {
      limit: 10,
    },
  })

  const subreddits: Subreddit[] = data?.getSubredditListLimit

  return (
    <div className="my-7 mx-auto max-w-5xl">
      <Head>
        <title>Reddit</title>
      </Head>
      <PostBox />
      <div className="flex">
        <Feed />
        <div className="sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 lg:inline">
          <p className="text-md mb-1 p-4 pb-3 font-bold">Top SubReddits</p>
          <div>
            {!subreddits ? (
              <div className="flex w-full items-center justify-center p-10 text-xl">
                <Jelly size={50} color="#FF4501" />
              </div>
            ) : (
              subreddits?.map((subreddit, idx) => (
                <SubredditRow
                  key={subreddit.id}
                  topic={subreddit.topic}
                  index={idx}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
