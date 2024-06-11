import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getTasks: protectedProcedure
    .input(
      z.object({
        start: z.date(),
        end: z.date(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.task.findMany({
        where: {
          ownerId: ctx.session.user.id,
          start: {
            gte: input.start,
          },
          end: {
            lte: input.end,
          },
        },
      });
    }),

  createTask: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        start: z.date(),
        end: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      await ctx.db.task.create({
        data: {
          name: input.name,
          description: input.description,
          start: input.start,
          end: input.end,
          ownerId: ctx.session.user.id,
        },
      });
    }),

  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        start: z.date().optional(),
        end: z.date().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          start: input.start,
          end: input.end,
        },
      });
    }),

  deleteTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.task.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
