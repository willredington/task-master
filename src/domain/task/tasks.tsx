import {
  useCopilotAction,
  useMakeCopilotReadable,
} from "@copilotkit/react-core";
import { useCallback, useState } from "react";
import { api } from "~/utils/api";
import { AddTaskModal } from "./add-task-modal";
import { Calendar } from "./calendar";
import { DeleteTaskModal } from "./delete-task-modal";
import { useDateStore } from "./state";
import { type Task } from "./types";

export const Tasks = () => {
  const [selectedTaskId, setSelectedTaskId] = useState("");

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
    setSelectedTaskId(task.id);
  }, []);

  const handleEmptySpace = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setSelectedDateRange({ start, end });
    },
    [],
  );

  useMakeCopilotReadable(
    `These are the tasks for the week: ${JSON.stringify(tasks)}`,
  );

  useCopilotAction({
    name: "addTask",
    description:
      "help the user add actions to their tasks for the week, try your best to make sure any added tasks do not overlap with existing tasks and warn the user if they do",
    parameters: [
      {
        name: "name",
        description: "name of the task to add",
        type: "string",
        required: true,
      },
      {
        name: "start",
        description: "starting date and time as an ISO string of the task",
        type: "string",
        required: true,
      },
      {
        name: "end",
        description: "ending date and time as an ISO string of the task",
        type: "string",
        required: true,
      },
    ],
    handler: async (params) => {
      await createTaskMutation.mutateAsync({
        name: params.name,
        start: new Date(params.start),
        end: new Date(params.end),
      });
      // TODO: trigger toast
    },
  });

  // useCopilotAction({
  //   name: "updateTask",
  //   description: "help the user update actions in their list of tasks",
  //   parameters: [
  //     {
  //       name: "id",
  //       description: "ID of the task",
  //       type: "string",
  //       required: true,
  //     },
  //     {
  //       name: "name",
  //       description: "name of the task to add",
  //       type: "string",
  //       required: false,
  //     },
  //     {
  //       name: "start",
  //       description: "starting date and time as an ISO string of the task",
  //       type: "string",
  //       required: false,
  //     },
  //     {
  //       name: "end",
  //       description: "ending date and time as an ISO string of the task",
  //       type: "string",
  //       required: false,
  //     },
  //   ],
  //   handler: async (params) => {
  //     console.log(params);
  //   },
  // });

  return (
    <>
      <div className="flex flex-col items-stretch space-y-4">
        {isLoading && <p>Loading tasks...</p>}
        <Calendar
          tasks={tasks}
          onTaskSelect={handleTaskSelect}
          onEmptySpaceSelect={handleEmptySpace}
        />
      </div>
      {selectedDateRange && (
        <AddTaskModal
          start={selectedDateRange.start}
          end={selectedDateRange.end}
          onClose={() => setSelectedDateRange(null)}
        />
      )}
      <DeleteTaskModal
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId("")}
      />
    </>
  );
};
