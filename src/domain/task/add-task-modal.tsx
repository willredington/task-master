import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <p>asdfasdfads</p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
