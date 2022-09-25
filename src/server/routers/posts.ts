import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'

export const posts = createRouter()
  .query('byId', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const post = await prisma.forum_post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: true
        }
      })
      
      return post
    }
  })
  .query('all', {
    async resolve() {
      return await prisma.forum_post.findMany({})
    }
  })
  .mutation('add', {
    input: z.object({
      title: z.string(),
      content: z.string(),
      topic: z.string()
    }),
    async resolve({ input, ctx }) {
      const { title, content, topic } = input

      const result = await prisma.forum_post.create({
        data: {
          title,
          content,
          topic: topic.toLowerCase(),
          authorId: parseInt(ctx.user!.id)
        },
        select: {
          id: true
        }
      })

      return result
    }
  })
