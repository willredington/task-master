import { VStack, Container } from "@chakra-ui/react";
import Head from "next/head";
import { type PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Head>
        <title>Task Master</title>
        <meta name="description" content="task master app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack h="full" align={"stretch"} spacing={4}>
        <Container maxW={"container.xl"}>
          <VStack h="full" w="full" spacing={6} my={2}>
            {children}
          </VStack>
        </Container>
      </VStack>
    </>
  );
}
