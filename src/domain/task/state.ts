import { DateTime } from "luxon";
import { create } from "zustand";
import { type View as TimeFrameView } from "react-big-calendar";

type DateStateProps = {
  selectedDateTime: DateTime;
  timeFrameView: TimeFrameView;
  dateTimeRange: [start: DateTime, end: DateTime];
};

function makeInitialStateProps(): DateStateProps {
  const now = DateTime.now();
  return {
    timeFrameView: "week",
    selectedDateTime: now,
    dateTimeRange: [now.startOf("week"), now.endOf("week")],
  };
}

type DateStateActions = {
  setSelectedDateTime: (dateTime: DateTime) => void;
  setTimeFrameView: (view: TimeFrameView) => void;
};

type DateState = DateStateProps & DateStateActions;

export const useDateStore = create<DateState>((set, get) => ({
  ...makeInitialStateProps(),

  setTimeFrameView: (timeFrameView) =>
    set({
      timeFrameView,
    }),

  setSelectedDateTime: (selectedDateTime) => {
    const { timeFrameView } = get();

    const dateTimeUnit =
      timeFrameView === "day"
        ? "day"
        : timeFrameView === "week"
          ? "week"
          : "month";

    set({
      selectedDateTime,
      dateTimeRange: [
        selectedDateTime.startOf(dateTimeUnit),
        selectedDateTime.endOf(dateTimeUnit),
      ],
    });
  },
}));
