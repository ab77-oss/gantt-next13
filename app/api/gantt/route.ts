import { NextResponse } from "next/server";
import { Dependencies, Tasks } from "@prisma/client";
import {prisma} from "@/app/utils/db"

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

export  async function GET(){
    try {
        const tasks = await prisma.tasks.findMany();
        console.log(tasks)
        const dependencies = await prisma.dependencies.findMany();
        console.log(dependencies)
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

    export  async function POST(){
        try {
            
        } catch (error) {
            return NextResponse.json(null)
        }
    }