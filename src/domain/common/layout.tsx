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
      <div className="flex min-h-screen flex-col">
        <div className="container flex w-full max-w-7xl flex-grow">
          <div className="flex flex-1 flex-col space-y-6">{children}</div>
        </div>
      </div>
    </>
  );
}
