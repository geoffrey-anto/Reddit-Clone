import Image from 'next/image'
import { ChevronDownIcon, HomeIcon, SearchIcon } from '@heroicons/react/solid'
import {
  BellIcon,
  ChatIcon,
  GlobeIcon,
  MenuIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/outline'
import { signIn, signOut, useSession } from 'next-auth/react'

function Header() {
  const { data: session, status: string } = useSession()
  return (
    <div className="flex bg-white py-2 px-4 shadow-sm items-center">
      <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
        <Image
          src="https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Reddit_logo_new.svg/2560px-Reddit_logo_new.svg.png"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="mx-7 flex items-center xl:min-w-[300px]">
        <HomeIcon className="h-5 w-5" />
        <p className="ml-2 hidden flex-1 lg:inline">Home</p>
        <ChevronDownIcon className="h-5 w-5" />
      </div>
      <form className="flex flex-1 items-center space-x-2 rounded-sm border border-gray-400">
        <SearchIcon className="h-12 w-6 bg-gray-100 px-3 py-1 text-gray-400" />
        <input
          placeholder="Search Reddit"
          className="flex-1 bg-transparent outline-none"
        />
        <button hidden type="submit" />
      </form>
      <div className="mx-5 hidden items-center space-x-2 text-gray-500 md:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-gray-100" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <SpeakerphoneIcon className="icon" />
      </div>
      <div className="ml-5 items-center md:hidden">
        <MenuIcon className="icon" />
      </div>
      {session ? (
        <div
          onClick={() => signOut()}
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-1 md:flex"
        > 
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              src="https://logoeps.com/wp-content/uploads/2014/09/52053-reddit-logo-icon-vector-icon-vector-eps.png"
              layout="fill"
            />
          </div>
          <div className="flex flex-col items-center justify-around">
            <p className="truncate text-md">{session?.user?.name}</p>
            <p className="text-gray-400 text-sm">Sign Out</p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 md:flex"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              src="https://logoeps.com/wp-content/uploads/2014/09/52053-reddit-logo-icon-vector-icon-vector-eps.png"
              layout="fill"
            />
          </div>
          <p className="text-gray-400 text-lg">Sign In</p>
        </div>
      )}
    </div>
  )
}

export default Header
