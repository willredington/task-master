import { z } from "zod";
import { type RouterOutputs } from "~/utils/api";

export type Task = RouterOutputs["task"]["getTasks"][0];

export const EditTaskFormState = z.object({
  name: z.string().optional(),
  start: z.date().optional(),
  end: z.date().optional(),
});

export type EditTaskFormState = z.infer<typeof EditTaskFormState>;
