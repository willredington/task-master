import { Box, Center, Spinner } from "@chakra-ui/react";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { signIn, useSession } from "next-auth/react";
import { type PropsWithChildren } from "react";
import { Layout } from "./layout";

export const Protected = ({ children }: PropsWithChildren) => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Layout>
        <Center>
          <Spinner />
        </Center>
      </Layout>
    );
  }

  if (status === "unauthenticated") {
    return signIn();
  }

  if (status === "authenticated") {
    return (
      <Box flex={1}>
        <CopilotKit url="/api/copilotkit/openai">
          <CopilotSidebar>
            <Layout>{children}</Layout>
          </CopilotSidebar>
        </CopilotKit>
      </Box>
    );
  }
};
