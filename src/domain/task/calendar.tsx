import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { useCallback, useMemo } from "react";
import {
  Calendar as RCalendar,
  dateFnsLocalizer,
  type Event as CalendarEvent,
  type SlotInfo,
} from "react-big-calendar";
import { useDateStore } from "./state";
import { type Task } from "./types";
import { tasksToCalendarEvents } from "./util";

const locales = {
  "en-US": enUS,
};

// the react-big-calendar lib has some typing/linting issues hence the following
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const Calendar = ({
  tasks,
  onTaskSelect,
  onEmptySpaceSelect,
}: {
  tasks: Task[];
  onTaskSelect?: (props: { task: Task }) => void;
  onEmptySpaceSelect?: (props: { start: Date; end: Date }) => void;
}) => {
  const { timeFrameView, setTimeFrameView } = useDateStore();

  const calendarEvents = useMemo(() => tasksToCalendarEvents(tasks), [tasks]);

  const handleCalendarEvent = useCallback(
    (calendarEvent: CalendarEvent) => {
      if (onTaskSelect && calendarEvent.resource) {
        onTaskSelect({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          task: calendarEvent.resource as Task,
        });
      }
    },
    [onTaskSelect],
  );

  const handleSlot = useCallback(
    (slotInfo: SlotInfo) => {
      if (onEmptySpaceSelect) {
        onEmptySpaceSelect({
          start: slotInfo.start,
          end: slotInfo.end,
        });
      }
    },
    [onEmptySpaceSelect],
  );

  return (
    <RCalendar
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      view={timeFrameView}
      views={["week"]}
      onView={setTimeFrameView}
      onSelectSlot={handleSlot}
      onSelectEvent={handleCalendarEvent}
      style={{ height: 700 }}
      selectable
    />
  );
};
