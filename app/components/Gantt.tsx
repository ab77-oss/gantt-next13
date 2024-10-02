import { LegacyRef } from "react";
import { ganttConfig, projectConfig } from "../../ganttConfig";
import { BryntumGantt, BryntumProjectModel } from "@bryntum/gantt-react";
type Props = {
  ganttRef: LegacyRef<BryntumGantt> | undefined;
};
export default function Gantt({ ganttRef }: Props) {
  return <BryntumGantt 
  ref={ganttRef} 
  {...ganttConfig} 
  project={projectConfig}
  />;


}