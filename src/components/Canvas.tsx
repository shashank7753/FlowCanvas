import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  useReactFlow,
  Panel,
  Edge,
  BackgroundVariant,

  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,

  ConnectionMode,
} from 'reactflow';
import { motion, Variants } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import 'reactflow/dist/style.css';
import useWorkflowStore from '../store/workflowStore';
import { NodeType, WorkflowNode } from '../types/workflow';

const SNAP_GRID: [number, number] = [15, 15];

// Theme configurations
const THEME_CONFIGS = {
  light: {
    background: 'bg-gray-50',
    nodeColors: {
      input: '#22c55e',    // Green
      process: '#3b82f6',  // Blue
      output: '#f97316',   // Orange
      default: '#6366f1',  // Indigo
    },
    text: 'text-gray-800',
    panel: 'bg-white/90',
    controls: 'bg-white/90',
    edge: '#2563eb',
  },
  dark: {
    background: 'bg-gray-900',
    nodeColors: {
      input: '#22c55e',    // Green
      process: '#60a5fa',  // Light Blue
      output: '#fb923c',   // Light Orange
      default: '#818cf8',  // Light Indigo
    },
    text: 'text-gray-200',
    panel: 'bg-gray-800/90',
    controls: 'bg-gray-800/90',
    edge: '#60a5fa',
  },
};

const animations: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  },
  buttonHover: {
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  },
};

interface CanvasProps {
  initialTheme?: 'light' | 'dark';
}

const Canvas: React.FC<CanvasProps> = ({ initialTheme = 'light' }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(initialTheme);
  const themeConfig = THEME_CONFIGS[theme];
  
  const { nodes, edges, addNode, addEdge, updateNode, removeNode, removeEdge } = useWorkflowStore();
  const { project, fitView } = useReactFlow();

  // Apply theme-specific styles to nodes
  const styledNodes = useMemo(() => 
    nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        background: themeConfig.nodeColors[node.type as keyof typeof themeConfig.nodeColors] || themeConfig.nodeColors.default,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
    })),
    [nodes, theme]
  );

  // Theme toggle handler
  const toggleTheme = useCallback(() => {
    setTheme(curr => curr === 'light' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fitView({ padding: 0.1 }), 50);
    return () => clearTimeout(timer);
  }, [nodes.length, fitView]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback<React.DragEventHandler>(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = project({
        x: event.clientX - 150,
        y: event.clientY - 30,
      });

      const newNode: WorkflowNode = {
        id: `${type}-${Date.now()}`,
        type: type as NodeType,
        position,
        data: {
          label: `New ${type}`,
          executionTime: 0,
          createdAt: new Date().toISOString(),
        },
        style: undefined
      };

      addNode(newNode);
    },
    [project, addNode]
  );

  const onNodesChange = useCallback<OnNodesChange>(
    (changes) => {
      changes.forEach((change: NodeChange) => {
        switch (change.type) {
          case 'position':
            if (change.position && change.dragging) {
              updateNode(change.id, { position: change.position });
            }
            break;
          case 'remove':
            removeNode(change.id);
            break;
        }
      });
    },
    [updateNode, removeNode]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      if (newConnection.source && newConnection.target) {
        removeEdge(oldEdge.id);
        addEdge({
          id: `e-${newConnection.source}-${newConnection.target}`,
          source: newConnection.source,
          target: newConnection.target,
          animated: true,
          style: { stroke: themeConfig.edge },
        });
      }
    },
    [removeEdge, addEdge, themeConfig]
  );

  const onEdgesChange = useCallback<OnEdgesChange>(
    (changes) => {
      changes.forEach((change: EdgeChange) => {
        if (change.type === 'remove') {
          removeEdge(change.id);
        }
      });
    },
    [removeEdge]
  );

  const onConnect = useCallback<OnConnect>(
    (params) => {
      if (params.source && params.target) {
        addEdge({
          id: `e-${params.source}-${params.target}`,
          source: params.source,
          target: params.target,
          animated: true,
          style: { stroke: themeConfig.edge },
        });
      }
    },
    [addEdge, themeConfig]
  );

  const flowProps = useMemo(() => ({
    nodes: styledNodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgeUpdate,
    onDragOver,
    onDrop,
    snapToGrid: true,
    snapGrid: SNAP_GRID,
    connectionMode: ConnectionMode.Strict,
    defaultEdgeOptions: {
      animated: true,
      style: { stroke: themeConfig.edge },
    },
    fitView: true,
    fitViewOptions: { padding: 0.1 },
  }), [styledNodes, edges, onNodesChange, onEdgesChange, onConnect, onEdgeUpdate, onDragOver, onDrop, themeConfig]);

  return (
    <motion.div 
      className={`flex-1 h-full relative ${themeConfig.background} transition-colors duration-300`}
      initial="hidden"
      animate="visible"
      variants={animations.fadeIn}>
      <ReactFlow {...flowProps}>
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          className={themeConfig.background}
        />
        <Controls 
          className={`shadow-lg ${themeConfig.controls} backdrop-blur-sm rounded-lg`}
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        <MiniMap 
          className={`border border-gray-200 shadow-md rounded-lg ${themeConfig.panel}`}
          maskColor="rgba(0, 0, 0, 0.1)"
          nodeColor={themeConfig.nodeColors.default}
        />
        <Panel position="top-right" className="space-y-2">
          <motion.div
            className={`flex gap-2 p-2 ${themeConfig.panel} backdrop-blur-sm rounded-lg shadow-md`}
            variants={animations.fadeIn}>
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:ring-offset-2 transition-colors ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
              variants={animations.buttonHover}
              whileHover="hover">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.button>
            <motion.button
              onClick={() => useWorkflowStore.getState().undo()}
              className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow 
                         hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:ring-offset-2 transition-colors`}
              variants={animations.buttonHover}
              whileHover="hover">
              Undo
            </motion.button>
            <motion.button
              onClick={() => useWorkflowStore.getState().redo()}
              className={`px-4 py-2 bg-green-500 text-white font-semibold rounded shadow 
                         hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 
                         focus:ring-offset-2 transition-colors`}
              variants={animations.buttonHover}
              whileHover="hover">
              Redo
            </motion.button>
          </motion.div>
        </Panel>
      </ReactFlow>
    </motion.div>
  );
};

export default Canvas;

