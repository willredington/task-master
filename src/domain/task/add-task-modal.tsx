import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

const AddTaskFormData = z.object({
  name: z.string(),
});

type AddTaskFormData = z.infer<typeof AddTaskFormData>;

function formatDateRangeLabel({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}): string {
  const startDateTime = DateTime.fromJSDate(startDate);
  const endDateTime = DateTime.fromJSDate(endDate);

  const dateLabel =
    startDateTime.toFormat("MMMM d") + startDateTime.toFormat("S");

  const startTimeLabel = startDateTime.toFormat("h a").toLowerCase();
  const endTimeLabel = endDateTime.toFormat("h a").toLowerCase();

  return `${dateLabel} - ${startTimeLabel} to ${endTimeLabel}`;
}

export const AddTaskModal = ({
  start,
  end,
  onClose,
}: {
  start: Date;
  end: Date;
  onClose: () => void;
}) => {
  const utils = api.useUtils();

  const form = useForm<AddTaskFormData>({
    resolver: zodResolver(AddTaskFormData),
    defaultValues: {
      name: "",
    },
  });

  const createTaskMutation = api.task.createTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
      onClose();
    },
  });

  const onSubmit = async (data: AddTaskFormData) => {
    await createTaskMutation.mutateAsync({
      start,
      end,
      name: data.name,
    });
  };

  const dateRangeLabel = formatDateRangeLabel({
    startDate: start,
    endDate: end,
  });

  const isLoading = form.formState.isLoading;

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>{dateRangeLabel}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dentist Appointment" {...field} />
                  </FormControl>
                  <FormDescription>Add a friendly task name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onClose}>
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" variant={"outline"} disabled={isLoading}>
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
