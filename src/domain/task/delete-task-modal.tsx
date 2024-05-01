import { useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export const DeleteTaskModal = ({
  taskId,
  onClose,
}: {
  taskId?: string;
  onClose: () => void;
}) => {
  const utils = api.useUtils();

  const deleteTaskMutation = api.task.deleteTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
      onClose();
    },
  });

  const deleteTask = useCallback(async () => {
    if (taskId) {
      await deleteTaskMutation.mutateAsync({
        id: taskId,
      });
    }
  }, [taskId, deleteTaskMutation]);

  return (
    <AlertDialog open={!!taskId}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete this?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="items-baseline">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteTask}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
