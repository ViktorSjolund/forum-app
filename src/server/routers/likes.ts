import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'

export const likes = createRouter()
  .mutation('add', {
    input: z.object({
      postId: z.number()
    }),
    async resolve({ input, ctx }) {
      const { postId } = input

      const result = await prisma.forum_post_likes.findFirst({
        where: {
          user_id: parseInt(ctx.user!.id),
          post_id: postId
        }
      })

      if (!result) {
        try {
          await prisma.forum_post_likes.create({
            data: {
              post_id: postId,
              user_id: parseInt(ctx.user!.id)
            }
          })

          return true
        } catch (e) {
          throw new trpc.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong...'
          })
        }
      } else {
        return false
      }
    }
  })
  .mutation('remove', {
    input: z.object({
      postId: z.number()
    }),
    async resolve ({ input, ctx }) {
      const { postId } = input

      try {
        await prisma.forum_post_likes.deleteMany({
          where: {
            user_id: parseInt(ctx.user!.id),
            post_id: postId,
          }
        })

        return true
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong...'
        })
      }
    }
  })
  .query('totalCountByPostId', {
    input: z.object({
      postId: z.number()
    }),
    async resolve({ input }) {
      const { postId } = input

      try {
        const result = await prisma.forum_post_likes.findMany({
          where: {
            post_id: postId
          }
        })

        return result.length
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong...'
        })
      }
    }
  })