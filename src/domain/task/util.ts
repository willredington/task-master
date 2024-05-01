import { type Event as CalendarEvent } from "react-big-calendar";
import { type Task } from "./types";

export function tasksToCalendarEvents(tasks: Task[]): CalendarEvent[] {
  return tasks.map(
    (task) =>
      ({
        start: task.start,
        end: task.end,
        title: task.name,
        resource: task,
      }) satisfies CalendarEvent,
  );
}
