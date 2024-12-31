
import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  useReactFlow,
  Panel,
  Edge,
  BackgroundVariant,
} from 'reactflow';
import { motion } from 'framer-motion';
import 'reactflow/dist/style.css';
import useWorkflowStore from '../store/workflowStore';
import { NodeType, WorkflowNode } from '../types/workflow';

const Canvas: React.FC = () => {
  const { nodes, edges, addNode, addEdge, updateNode, removeNode, removeEdge } = useWorkflowStore();
  const { project } = useReactFlow();

  const fadeIn = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonHover = {
    scale: 1.1,
    transition: { type: 'spring', stiffness: 300 },
  };

  useEffect(() => {
    // Effect placeholder
  }, [nodes, edges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = project({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: WorkflowNode = {
        id: `${type}-${Date.now()}`,
        type: type as NodeType,
        position,
        data: { label: `New ${type}`, executionTime: 0 },
      };

      addNode(newNode);
    },
    [project, addNode]
  );

  const onNodesChange = useCallback(
    (changes: any) => {
      changes.forEach((change: any) => {
        if (change.type === 'position' && change.dragging) {
          updateNode(change.id, { position: change.position });
        } else if (change.type === 'remove') {
          removeNode(change.id);
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
          id: `${newConnection.source}-${newConnection.target}`,
          source: newConnection.source,
          target: newConnection.target,
        });
      }
    },
    [removeEdge, addEdge]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      changes.forEach((change: any) => {
        if (change.type === 'remove') {
          removeEdge(change.id);
        }
      });
    },
    [removeEdge]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        addEdge({
          id: `${params.source}-${params.target}`,
          source: params.source,
          target: params.target,
        });
      }
    },
    [addEdge]
  );

  return (
    <motion.div 
      className="flex-1 h-full"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onDragOver={onDragOver}
        onDrop={onDrop}
        snapToGrid
        snapGrid={[15, 15]}
        fitView
      >
       <Background variant={BackgroundVariant.Dots} gap={16} size={1} />;
        <Controls className="shadow-lg" />
        <MiniMap className="border border-gray-200 shadow-md" />
        <Panel position="top-right">
          <motion.div
            className="flex gap-2 p-2 bg-white rounded shadow-md"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <motion.button
              onClick={() => useWorkflowStore.getState().undo()}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 focus:outline-none"
              whileHover={buttonHover} >
              Undo
            </motion.button>
            <motion.button
              onClick={() => useWorkflowStore.getState().redo()}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded shadow hover:bg-green-600 focus:outline-none"
              whileHover={buttonHover} >
              Redo
            </motion.button>
          </motion.div>
        </Panel>
      </ReactFlow>
    </motion.div>
  );
};

export default Canvas;
