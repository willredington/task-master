import { DateTime } from "luxon";
import { create } from "zustand";

type DateStateProps = {
  startDateTime: DateTime;
  endDateTime: DateTime;
};

function makeInitialStateProps(): DateStateProps {
  const now = DateTime.now();
  return {
    startDateTime: now.startOf("week"),
    endDateTime: now.endOf("week"),
  };
}

type DateStateActions = {
  setDateTimeRange: (props: {
    startDateTime: DateTime;
    endDateTime: DateTime;
  }) => void;
};

type DateState = DateStateProps & DateStateActions;

export const useDateStore = create<DateState>((set) => ({
  ...makeInitialStateProps(),
  setDateTimeRange: ({ startDateTime, endDateTime }) => {
    set({
      startDateTime,
      endDateTime,
    });
  },
}));
