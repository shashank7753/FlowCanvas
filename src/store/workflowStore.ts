import { create } from 'zustand';
import { Edge, Workflow, WorkflowNode } from '../types/workflow';

interface WorkflowState {
  redo: () => void;
  undo: () => void;
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
  undoStack: { nodes: WorkflowNode[]; edges: Edge[] }[];
  redoStack: { nodes: WorkflowNode[]; edges: Edge[] }[];
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
}

const STORAGE_KEY = 'workflow-state';

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,

  // History stacks for undo/redo
  undoStack: [] as { nodes: WorkflowNode[]; edges: Edge[] }[],
  redoStack: [] as { nodes: WorkflowNode[]; edges: Edge[] }[],

  isDirty: false,

  setDirty: (dirty) => set({ isDirty: dirty }),

  redo: () => {
    const { redoStack, undoStack, setDirty } = get();
    if (redoStack.length === 0) return;

    const nextState = redoStack.pop();
    if (nextState) {
      set({
        nodes: nextState.nodes,
        edges: nextState.edges,
        undoStack: [...undoStack, { nodes: get().nodes, edges: get().edges }],
      });
      setDirty(true);
    }
  },

  undo: () => {
    const { undoStack, redoStack, setDirty } = get();
    if (undoStack.length === 0) return;

    const previousState = undoStack.pop();
    if (previousState) {
      set({
        nodes: previousState.nodes,
        edges: previousState.edges,
        redoStack: [...redoStack, { nodes: get().nodes, edges: get().edges }],
      });
      setDirty(true);
    }
  },

  addNode: (node) => {
    set((state) => {
      const newNodeState = { nodes: [...state.nodes, node], edges: state.edges };
      return {
        nodes: newNodeState.nodes,
        edges: newNodeState.edges,
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        isDirty: true,
      };
    });
  },

  updateNode: (id, updates) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node
      );
      return {
        nodes: updatedNodes,
        edges: state.edges,
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        isDirty: true,
      };
    });
  },

  removeNode: (id) => {
    set((state) => {
      const filteredNodes = state.nodes.filter((node) => node.id !== id);
      const filteredEdges = state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      );
      return {
        nodes: filteredNodes,
        edges: filteredEdges,
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        isDirty: true,
      };
    });
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  addEdge: (edge) => {
    set((state) => {
      const newEdgeState = { nodes: state.nodes, edges: [...state.edges, edge] };
      return {
        nodes: state.nodes,
        edges: newEdgeState.edges,
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        isDirty: true,
      };
    });
  },

  removeEdge: (id) => {
    set((state) => {
      const filteredEdges = state.edges.filter((edge) => edge.id !== id);
      return {
        nodes: state.nodes,
        edges: filteredEdges,
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        isDirty: true,
      };
    });
  },

  loadWorkflow: (workflow) => set({ ...workflow, isDirty: false }),

  saveWorkflow: () => {
    const { nodes, edges, setDirty } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    setDirty(false);
  },
}));

// Handle `beforeunload` event
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', (event) => {
    const { isDirty } = useWorkflowStore.getState();
    if (isDirty) {
      event.preventDefault();
      event.returnValue = ''; // Required for modern browsers
    }
  });
}

export default useWorkflowStore;
