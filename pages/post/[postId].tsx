import { useMutation, useQuery } from '@apollo/client'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactTimeago from 'react-timeago'
import Avatar from '../../components/Avatar'
import Post from '../../components/Post'
import { ADD_COMMENT } from '../../graphql/mutations'
import { GET_ALL_POSTS_BY_ID } from '../../graphql/queries'

type FormData = {
  comment: string
}

function PostPage() {
  const router = useRouter()
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_ALL_POSTS_BY_ID, 'getPostListByPostId'],
  })
  const { data } = useQuery(GET_ALL_POSTS_BY_ID, {
    variables: {
      post_id: router.query.postId,
    },
  })
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>()
  const { data: session } = useSession()
  const post: Post = data?.getPostListByPostId
  const onSubmit_: SubmitHandler<FormData> = async (data) => {
    const notification = toast.loading('Posting Your Comment...')
    await addComment({
      variables: {
        post_id: router.query.postId,
        username: session?.user?.name,
        text: data.comment,
      },
    })
    setValue('comment', '')
    toast.success('Comment Successfully Posted!', {
      id: notification,
    })
  }

  if (!post) {
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    )
  }

  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Post post={post} />
      <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
        <p className="mb-1 text-sm">
          Comment as<span className="text-red-500"> {session?.user?.name}</span>
        </p>
        <form
          onSubmit={handleSubmit(onSubmit_)}
          className="flex flex-col space-y-2"
        >
          <textarea
            {...register('comment')}
            disabled={!session}
            className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
            placeholder={
              session ? 'What are your thoughts?' : 'Please sign in to comment'
            }
          />
          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"
          >
            <span className="text-md">Comment</span>
          </button>
        </form>
      </div>
      <div className="px10 -my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5">
        <hr className="py-2" />
        {post?.comments.map((comment) => (
          <div
            key={comment.id}
            className="relative flex items-center space-x-2 space-y-5"
          >
            <hr className="absolute top-10 left-7 z-0 h-16 border" />
            <div className="z-50">
              <Avatar seed={comment.username} />
            </div>
            <div className="flex flex-col">
              <p className="py-2 text-xs text-gray-400">
                <span className="font-sembold text-gray-600">
                  {comment.username}
                </span>{' '}
                . <ReactTimeago date={comment.created_at} />
              </p>
              <p className="">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostPage