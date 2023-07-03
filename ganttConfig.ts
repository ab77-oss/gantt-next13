import type { BryntumGanttProps } from "@bryntum/gantt-react";
import { ProjectModel } from "@bryntum/gantt";

const ganttConfig: BryntumGanttProps = {
  columns: [{ type: "name", field: "name", width: 250 }],
  viewPreset: "weekAndDayLetter",
  barMargin: 10,
};

const project = new ProjectModel({
    taskStore: {
      autoTree: true,
      transformFlatData: true,
    },
    transport: {
      load: {
        url: "http://localhost:3000/api/gantt",
      },
    },
    autoLoad: true,
    validateResponse: true,
  });

export { ganttConfig, project };