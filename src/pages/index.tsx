import { Protected } from "~/domain/common";

export default function Home() {
  return (
    <Protected>
      <div>
        <p>hello world</p>
      </div>
    </Protected>
  );
}
