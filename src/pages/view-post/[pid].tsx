import Header from '@/components/header'
import { trpc } from '@/utils/trpc'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { ThumbUpOffAlt, ThumbUpAlt, ThumbDownOffAlt, ThumbDownAlt } from '@mui/icons-material'
import { useEffect, useState } from 'react'

const Post = () => {
  const router = useRouter()
  const { pid } = router.query
  const postId = Array.isArray(pid) ? parseInt(pid[0]) : parseInt(pid!)

  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)

  const { data: isLikedData, isLoading: isLikedLoading } = trpc.useQuery([
    'like.userHasLikedPost',
    { postId },
  ])
  const { data: isDislikedData, isLoading: isDislikedLoading } = trpc.useQuery([
    'dislike.userHasDislikedPost',
    { postId },
  ])
  const { data: likesData, isLoading: likesLoading } = trpc.useQuery([
    'like.totalCountByPostId',
    { postId },
  ])
  const { data: dislikesData, isLoading: dislikesLoading } = trpc.useQuery([
    'dislike.totalCountByPostId',
    { postId },
  ])

  useEffect(() => {
    if (!isLikedLoading && !isDislikedLoading) {
      setIsLiked(isLikedData!)
      setIsDisliked(isDislikedData!)
    }

    if (!likesLoading && !dislikesLoading) {
      setLikes(likesData!)
      setDislikes(dislikesData!)
    }
  }, [
    isLikedData,
    isDislikedData,
    isLikedLoading,
    isDislikedLoading,
    likesData,
    dislikesData,
    likesLoading,
    dislikesLoading,
  ])

  const { data: post } = trpc.useQuery(['post.byId', { id: postId }])

  const addLike = trpc.useMutation(['like.add'])
  const removeLike = trpc.useMutation(['like.remove'])
  const addDislike = trpc.useMutation(['dislike.add'])
  const removeDislike = trpc.useMutation(['dislike.remove'])

  if (!post) {
    return <div>Loading...</div>
  }

  const handleAddLike = async () => {
    setLikes(likes + 1)
    if (isDisliked) {
      setDislikes(dislikes - 1)
    }
    setIsDisliked(false)
    setIsLiked(true)
    await removeDislike.mutateAsync({
      postId,
    })
    await addLike.mutateAsync({
      postId,
    })
  }

  const handleAddDislike = async () => {
    setDislikes(dislikes + 1)
    if (isLiked) {
      setLikes(likes - 1)
    }
    setIsDisliked(true)
    setIsLiked(false)
    await removeLike.mutateAsync({
      postId,
    })
    await addDislike.mutateAsync({
      postId,
    })
  }

  const handleRemoveDislike = async () => {
    setDislikes(dislikes - 1)
    setIsDisliked(false)
    await removeDislike.mutateAsync({
      postId,
    })
  }

  const handleRemoveLike = async () => {
    setLikes(likes - 1)
    setIsLiked(false)
    await removeLike.mutateAsync({
      postId,
    })
  }

  return (
    <div>
      <Header />
      <Typography
        variant='h2'
        component='h1'
        color='white'
        gutterBottom
      >
        {post.title}
      </Typography>
      <Typography
        color='white'
        paragraph
        width='60%'
      >
        {post.content}
      </Typography>
      <Typography color='white'>{post.created_at.toString()}</Typography>
      <Typography color='white'>{post.updated_at.toString()}</Typography>
      <Typography color='white'>{post.author.username}</Typography>
      <Box
        display='flex'
        sx={{ svg: { cursor: 'pointer' } }}
      >
        <Box display='flex'>
          <Typography>{likes}</Typography>
          {isLiked ? (
            <ThumbUpAlt onClick={handleRemoveLike} />
          ) : (
            <ThumbUpOffAlt onClick={handleAddLike} />
          )}
        </Box>
        <Box display='flex'>
          {isDisliked ? (
            <ThumbDownAlt onClick={handleRemoveDislike} />
          ) : (
            <ThumbDownOffAlt onClick={handleAddDislike} />
          )}
          <Typography>{dislikes}</Typography>
        </Box>
      </Box>
    </div>
  )
}

export default Post
