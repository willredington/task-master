import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const AddTaskState = z.object({
  name: z.string(),
  start: z.date(),
  end: z.date(),
});

type AddTaskState = z.infer<typeof AddTaskState>;

export const AddTaskModal = () => {
  const { control } = useForm<AddTaskState>({
    resolver: zodResolver(AddTaskState),
  });

  return (
    <div>
      <p>hello world</p>
    </div>
  );
};
