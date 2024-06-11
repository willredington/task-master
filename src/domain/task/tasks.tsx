import {
  useCopilotAction,
  useMakeCopilotReadable,
} from "@copilotkit/react-core";
import { useCallback, useState } from "react";
import { api } from "~/utils/api";
import { AddTaskModal } from "./add-task-modal";
import { Calendar, useDateStore } from "~/domain/calendar";
import { type Task } from "./types";
import { Spinner } from "@chakra-ui/react";
import { EditTaskModal } from "./edit-task-modal";

export const Tasks = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const { startDateTime, endDateTime } = useDateStore();

  const utils = api.useUtils();

  const { isLoading, data: tasks = [] } = api.task.getTasks.useQuery({
    start: startDateTime.toJSDate(),
    end: endDateTime.toJSDate(),
  });

  const createTaskMutation = api.task.createTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
    },
  });

  const handleTaskSelect = useCallback(({ task }: { task: Task }) => {
    setSelectedTask(task);
  }, []);

  const handleEmptySpace = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setSelectedDateRange({ start, end });
    },
    [],
  );

  useMakeCopilotReadable(
    `These are the tasks for this date range from ${selectedDateRange?.start.toDateString()} to ${selectedDateRange?.end.toDateString()}: ${JSON.stringify(tasks)}`,
  );

  console.log("tasks", tasks);

  useCopilotAction({
    name: "addTask",
    description: `help the user add actions to their tasks for the week, try your best to make sure any added tasks do not overlap with existing tasks and warn the user if they do, today's date is ${new Date().toDateString()}`,
    parameters: [
      {
        name: "name",
        description: "name of the task to add",
        type: "string",
        required: true,
      },
      {
        name: "start",
        description: `starting date and time as an ISO string of the task without the timezone`,
        type: "string",
        required: true,
      },
      {
        name: "end",
        description: `ending date and time as an ISO string of the task without the timezone`,
        type: "string",
        required: true,
      },
    ],
    handler: async (params) => {
      console.log("addTask params", params);
      await createTaskMutation.mutateAsync({
        name: params.name,
        start: new Date(params.start),
        end: new Date(params.end),
      });
    },
  });

  return (
    <>
      {isLoading && <Spinner />}
      <Calendar
        tasks={tasks}
        onTaskSelect={handleTaskSelect}
        onEmptySpaceSelect={handleEmptySpace}
      />
      <EditTaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
      {selectedDateRange && (
        <AddTaskModal
          startDate={selectedDateRange.start}
          endDate={selectedDateRange.end}
          onClose={() => setSelectedDateRange(null)}
        />
      )}
    </>
  );
};
