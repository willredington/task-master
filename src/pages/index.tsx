import { Protected } from "~/domain/common";
import { Tasks } from "~/domain/task";

export default function Home() {
  return (
    <Protected>
      <Tasks />
    </Protected>
  );
}
