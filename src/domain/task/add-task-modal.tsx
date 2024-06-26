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

const AddTaskFormData = z.object({
  name: z.string().min(1),
});

type AddTaskFormData = z.infer<typeof AddTaskFormData>;

export const AddTaskModal = ({
  startDate,
  endDate,
  onClose,
}: {
  startDate: Date;
  endDate: Date;
  onClose: () => void;
}) => {
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    formState: { isLoading, isValid, errors },
  } = useForm<AddTaskFormData>({
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
      start: startDate,
      end: endDate,
      name: data.name,
    });
  };

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Task</ModalHeader>
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
              <Text>{startDate.toISOString()}</Text>
              <HStack justify={"space-between"} alignSelf={"stretch"}>
                <Button colorScheme="blue" onClick={onClose}>
                  Close
                </Button>
                <Button
                  type="submit"
                  colorScheme="green"
                  isLoading={isLoading}
                  isDisabled={!isValid}
                >
                  Create
                </Button>
              </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
