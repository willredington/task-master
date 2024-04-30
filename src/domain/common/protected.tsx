import { signIn, useSession } from "next-auth/react";
import { type PropsWithChildren } from "react";
import { Layout } from "./layout";
import { LoaderCircle } from "lucide-react";

export const Protected = ({ children }: PropsWithChildren) => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Layout>
        <div className="flex flex-1 flex-col items-center justify-center">
          <LoaderCircle className="animate-spin" size={100} />
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") {
    return signIn();
  }

  if (status === "authenticated") {
    return <Layout>{children}</Layout>;
  }
};
