import { NextResponse } from "next/server";
import { prisma } from "../../utils/db";
import { Dependencies, Tasks } from "@prisma/client";
import {
    sendResponse,
    createOperation,
    deleteOperation,
    updateOperation,
  } from "../../helpers/helpers";

  import crypto from "crypto";

  type SyncReqBodyTasksObj = {
    added?: Tasks[];
    updated?: Tasks[];
    removed?: Tasks[];
  };
  type SyncReqBodyDependenciesObj = {
    added?: Dependencies[];
    updated?: Dependencies[];
    removed?: Dependencies[];
  };
  type SyncReqBody = {
    type: "sync";
    reqestId: number;
    tasks: SyncReqBodyTasksObj;
    dependencies?: SyncReqBodyDependenciesObj;
  };

export type GanttDataGETRes = {
  success: boolean;
  tasks: {
    rows: Tasks[];
  };
  dependencies: {
    rows: Dependencies[];
  };
};
export type GanttDataPOSTRes = {
  success: boolean;
  requestId: number;
  tasks: {
    rows: Tasks[] | [];
    removed: Tasks[] | [];
  };
  dependencies: {
    rows: Dependencies[] | [];
    removed: Dependencies[] | [];
  };
};
export type GanttDataRes =
  | GanttDataGETRes
  | GanttDataPOSTRes
  | Partial<GanttDataPOSTRes>
  | { message: "Method not allowed" };



export async function GET (){
    try {
        const tasks = await prisma.tasks.findMany();
      const dependencies = await prisma.dependencies.findMany();
      return NextResponse.json({
        success: true,
        tasks: {
          rows: tasks,
        },
        dependencies: {
          rows: dependencies,
        },
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        tasks: {
          rows: [],
        },
        dependencies: {
          rows: [],
        },
      });
    }
  }
   
  export async function POST (
 request: Request
  ){
    try {
        
        const data: SyncReqBody = request.body as SyncReqBody | null;
        let requestId: number | null = null;
        let lastKey: "added" | "deleted" | "updated" | "error" | "" = "";
        let err = null;
        const taskUpdates: Tasks[] = [];
        const tasksRemoved: Tasks[] = [];
        const dependencyUpdates: Dependencies[] = [];
        const dependenciesRemoved: Dependencies[] = [];
        for (const [key, value] of Object.entries(data)) {
          if (key === "requestId") {
            requestId = value as number;
          }
          if (key === "tasks") {
            for (const [key2, value2] of Object.entries(
              value as SyncReqBodyTasksObj
            )) {
              if (key2 === "added") {
                value2.forEach((addObj) => taskUpdates.push(addObj));
                value2[0].id = crypto.randomUUID();
                const val = await createOperation(value2[0], "tasks");
                lastKey = val.msg;
                err = val.error;
              }
              if (key2 === "updated") {
                value2.forEach((updateObj) => taskUpdates.push(updateObj));
                const val = await updateOperation(value2, "tasks");
                lastKey = val.msg;
                err = val.error;
              }
              if (key2 === "removed") {
                tasksRemoved.push(value2[0]);
                const val = await deleteOperation(value2[0].id, "tasks");
                lastKey = val.msg;
                err = val.error;
              }
            }
          }
          if (key === "dependencies") {
            for (const [key2, value2] of Object.entries(
              value as SyncReqBodyDependenciesObj
            )) {
              if (key2 === "added") {
                value2[0].id = crypto.randomUUID();
                value2.forEach((addObj) => dependencyUpdates.push(addObj));
                const val = await createOperation(value2[0], "dependencies");
                lastKey = val.msg;
                err = val.error;
              }
              if (key2 === "updated") {
                value2.forEach((updateObj) => dependencyUpdates.push(updateObj));
                const val = await updateOperation(value2, "dependencies");
                lastKey = val.msg;
                err = val.error;
              }
              if (key2 === "removed") {
                dependenciesRemoved.push(value2[0]);
                const val = await deleteOperation(value2[0].id, "dependencies");
                lastKey = val.msg;
                err = val.error;
              }

            }
          }
        }
        return sendResponse(
          lastKey,
          requestId,
          err,
          taskUpdates,
          dependencyUpdates,
          tasksRemoved,
          dependenciesRemoved
        );

    }catch(error){
        return new NextResponse('Internal Error', { status: 500 });
    }
  }
