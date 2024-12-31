import { create } from 'zustand';
import { Edge, Workflow, WorkflowNode } from '../types/workflow';

interface WorkflowState {
  redo(): void;
  undo(): void;
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNode: WorkflowNode | null;
  addNode: (node: WorkflowNode) => void;
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (id: string) => void;
  setSelectedNode: (node: WorkflowNode | null) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (id: string) => void;
  loadWorkflow: (workflow: Workflow) => void;
  saveWorkflow: () => void;
}

const STORAGE_KEY = 'workflow-state';

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

  updateNode: (id, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node
      ),
    })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    })),

  setSelectedNode: (node) => set({ selectedNode: node }),

  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),

  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    })),

  loadWorkflow: (workflow) => set({ ...workflow }),

  saveWorkflow: () => {
    const { nodes, edges } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
  },
}));

export default useWorkflowStore;