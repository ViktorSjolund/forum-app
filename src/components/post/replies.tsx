import type { post_reply, user } from '@prisma/client'
import { Reply } from './reply'

type TRepliesProps = {
  replies: (post_reply & {
    author: user
  })[]
  refetchPost: () => Promise<void>
  showReplies: () => void
}

export const Replies = (props: TRepliesProps) => {
  const { replies, refetchPost, showReplies } = props

  return (
    <div>
      {replies.map((reply) => {
        return (
          <Reply
            reply={reply}
            key={reply.id}
            refetchPost={refetchPost}
            showReplies={showReplies}
          />
        )
      })}
    </div>
  )
}
