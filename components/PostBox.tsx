import { useMutation } from '@apollo/client'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import client from '../apollo-client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import Avatar from './Avatar'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subReddit: string
}

interface Props {
  subreddit?: string
}

function PostBox({ subreddit }: Props) {
  const { data: session } = useSession()
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, 'getPostList'],
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)
  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false)
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async (formData: FormData) => {
    const notification = toast.loading('Creating New Post')
    try {
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subReddit,
        },
      })
      const doesSubredditExist = getSubredditListByTopic.length > 0
      if (!doesSubredditExist) {
        console.log('Creating A New Subreddit')
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subReddit,
          },
        })
        console.log('Created A New Subreddit')
        const image = formData.postImage || ''
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })
        console.log('Add New Post ' + newPost)
        console.log('')
      } else {
        console.log('Adding Post In Existing Subreddit')
        const image = formData.postImage || ''
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })
        console.log('New Post Added' + newPost)
      }
      setValue('postBody', '')
      setValue('postImage', '')
      setValue('postTitle', '')
      setValue('subReddit', '')
      toast.success('New Post Created', {
        id: notification,
      })
    } catch (e) {
      console.log(e)
      toast.error('Something Went Wrong!', {
        id: notification,
      })
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-20 z-50 mb-4 mt-2 rounded-md border border-gray-300 bg-white p-2"
    >
      <div className="flex items-center space-x-3">
        <Avatar seed="dasfljn" />
        <input
          {...register('postTitle', { required: true })}
          disabled={!session}
          className="flex-1 rounded-md bg-gray-50 p-1 pl-5 outline-none"
          type="text"
          placeholder={
            session ? subreddit ? `Create a post in r/${subreddit}` : 'Create A Post By Entering A Title' : 'Sign In To Post'
          }
        />
        <PhotographIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer text-gray-500 ${
            imageBoxOpen && 'h-7 text-blue-400'
          }`}
        />
        <LinkIcon className="h-6 text-gray-500" />
      </div>
      {!!watch('postTitle') && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register('postBody', { required: true })}
              type="text"
              placeholder="Text (Optional)"
            />
          </div>
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Sub Reddit:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register(`subReddit`, { required: true })}
              type="text"
              placeholder="i.e. NextJs"
            />
          </div>
          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register(`postImage`)}
                type="text"
                placeholder="i.e. NextJs"
              />
            </div>
          )}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === 'required' && (
                <p>- A Post Title Is Required</p>
              )}
              {errors.subReddit?.type === 'required' && (
                <p>- A SubReddit Is Required</p>
              )}
            </div>
          )}
          {!!watch('postTitle') && (
            <button
              type="submit"
              className="w-full rounded-full bg-blue-400 p-2 text-white"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostBox
