export type NodeType = 'start' | 'end' | 'task' | 'decision';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    executionTime: number;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: Edge[];
}

