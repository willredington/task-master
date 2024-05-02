import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";
import { type Task } from "./types";
import { useCallback } from "react";

const EditTaskFormData = z.object({
  name: z.string().min(1),
});

type EditTaskFormData = z.infer<typeof EditTaskFormData>;

export const EditTaskModal = ({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: () => void;
}) => {
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    formState: { isLoading, isValid, errors },
  } = useForm<EditTaskFormData>({
    resolver: zodResolver(EditTaskFormData),
    values: {
      name: task?.name ?? "",
    },
  });

  const updateTaskMutation = api.task.updateTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
      onClose();
    },
  });

  const deleteTaskMutation = api.task.deleteTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
      onClose();
    },
  });

  const onDelete = useCallback(async () => {
    if (task) {
      await deleteTaskMutation.mutateAsync({
        id: task.id,
      });
    }
  }, [task, deleteTaskMutation]);

  const onSubmit = async (data: EditTaskFormData) => {
    if (task) {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        name: data.name,
      });
    }
  };

  return (
    <Modal isOpen={!!task} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>Edit Task</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6} align={"start"}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Task Name</FormLabel>
                <Input
                  {...register("name")}
                  placeholder="Dentist Appointment"
                />
                {!errors.name ? (
                  <FormHelperText>Enter a helpful task name</FormHelperText>
                ) : (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>
              <HStack justify={"space-between"} alignSelf={"stretch"}>
                <Button
                  colorScheme="red"
                  onClick={onDelete}
                  isLoading={deleteTaskMutation.isPending}
                >
                  Delete
                </Button>
                <Button
                  type="submit"
                  colorScheme="green"
                  isLoading={isLoading}
                  isDisabled={!isValid}
                >
                  Update
                </Button>
              </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
