import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import React from 'react'
import Avatar from './Avatar'

function PostBox() {
  const { data: session } = useSession()
  return (
    <form className='sticky top-16 z-50 bg-white border rounded-md border-gray-300 p-2 mx-4'>
      <div className='flex items-center space-x-3'>
        <Avatar seed='dasfljn'/>
        <input
          disabled={!session}
          className="rounded-md flex-1 bg-gray-50 p-1 pl-5 outline-none"
          type="text"
          placeholder={
            session ? 'Create A Post By Entering A Title' : 'Sign In To Post'
          }
        />
        <PhotographIcon className={`h-6 cursor-pointer text-gray-500`}/>
        <LinkIcon className='h-6 text-gray-500'/>
      </div>
    </form>
  )
}

export default PostBox
