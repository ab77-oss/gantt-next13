"use client"
import { useRef, LegacyRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { BryntumGantt } from "@bryntum/gantt-react";
const GanttDynamic = dynamic(() => import("./components/Gantt"), {
  ssr: false,
  loading: () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  },
});
export default function BryntumGanttPage() {
  const ganttRef = useRef() as LegacyRef<BryntumGantt> | undefined;
  return (
    <>
      <Head>
        <title>Bryntum Gantt using Next.js</title>
        <meta name="description" content="Bryntum Gantt using Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GanttDynamic ganttRef={ganttRef} />
    </>
  );
}