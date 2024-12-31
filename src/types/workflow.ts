export type NodeType = 'start' | 'end' | 'task' | 'decision';

export interface WorkflowNode {
  style: any;
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: React.CSSProperties;
}
export interface NodeData {
  label: string;
  executionTime: number;
  createdAt?: string; // Add the createdAt property
  style?: React.CSSProperties;
}
export interface Workflow {
  nodes: WorkflowNode[];
  edges: Edge[];
}
export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}
// export interface NodeProperties {
//   id: string;
//   name: string;
//   type: string;
// }