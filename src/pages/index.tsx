import { Layout } from "~/domain/common/layout";
import { Protected } from "~/domain/common/protected";

export default function Home() {
  return (
    <Protected>
      <div>
        <p>hello world</p>
      </div>
    </Protected>
  );
}
