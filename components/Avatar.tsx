import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

interface Props {
    seed?: string,
    large?: boolean
}

function Avatar(props: Props) {
  const { data: session } = useSession()
  return (
    <div className={`relative overflow-hidden h-10 w-10 rounded-full border-gray-300 bg-white ${props.large && "h-20 w-20"}`}>
      <Image
        layout="fill"
        src={`https://avatars.dicebear.com/api/open-peeps/${
          props.seed || session?.user?.name || 'placeholder'
        }.svg`}
      />
    </div>
  )
}

export default Avatar
