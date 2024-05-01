import {
  useCopilotAction,
  useMakeCopilotReadable,
} from "@copilotkit/react-core";
import { useCallback, useMemo, useState } from "react";
import { api } from "~/utils/api";
import { Calendar } from "./calendar";
import { useDateStore } from "./state";
import { DeleteTaskModal } from "./delete-task-modal";
import { type Task } from "./types";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

export const Tasks = () => {
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const { dateTimeRange } = useDateStore();

  const [startDate, endDate] = useMemo(
    () => [dateTimeRange[0].toJSDate(), dateTimeRange[1].toJSDate()] as const,
    [dateTimeRange],
  );

  const utils = api.useUtils();

  const { isLoading, data: tasks = [] } = api.task.getTasks.useQuery({
    start: startDate,
    end: endDate,
  });

  const createTaskMutation = api.task.createTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
    },
  });

  const handleTaskSelect = useCallback(({ task }: { task: Task }) => {
    setSelectedTaskId(task.id);
  }, []);

  useMakeCopilotReadable(
    `These are the tasks for the week: ${JSON.stringify(tasks)}`,
  );

  useCopilotAction({
    name: "addTask",
    description:
      "Help the user add actions to their tasks for the week, try your best to make sure any added tasks do not overlap with existing tasks and warn the user if they do",
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

  return (
    <>
      <div className="flex flex-col items-stretch space-y-4">
        {isLoading && <p>Loading tasks...</p>}
        <Calendar tasks={tasks} onTaskSelect={handleTaskSelect} />
        <Button className="flex items-center justify-between gap-2 self-end">
          Add
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <DeleteTaskModal
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId("")}
      />
    </>
  );
};
