import type { post_reply, user } from '@prisma/client'
import { UserCard } from './userCard'

type TReplyProps = {
  reply: post_reply & {
    author: user
  }
  refetchPost: () => Promise<void>
  showReplies: () => void
}

export const Reply = (props: TReplyProps) => {
  const { reply, refetchPost, showReplies } = props

  return (
    <div className='ml-12 mt-8'>
      <UserCard
        content={reply.content}
        createdAt={reply.created_at}
        updatedAt={reply.updated_at}
        username={reply.author.username}
        commentId={reply.comment_id}
        refetchPost={refetchPost}
        showReplies={showReplies}
      />
    </div>
  )
}
