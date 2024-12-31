import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  // Node,
  useReactFlow,
  Panel,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import useWorkflowStore from '../store/workflowStore';
import { NodeType, WorkflowNode } from '../types/workflow';

const Canvas: React.FC = () => {
  const { nodes, edges, addNode, addEdge, updateNode, removeNode, removeEdge } = useWorkflowStore();
  const { project } = useReactFlow();

  useEffect(() => {
   
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

  const onNodesChange = useCallback((changes: any) => {
    changes.forEach((change: any) => {
      if (change.type === 'position' && change.dragging) {
        updateNode(change.id, { position: change.position });
      } else if (change.type === 'remove') {
        removeNode(change.id);
      }
    });
  }, [updateNode, removeNode]);




  //addupdate
  const onEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection) => {
    if (newConnection.source && newConnection.target) {
      removeEdge(oldEdge.id);
      addEdge({
        id: `${newConnection.source}-${newConnection.target}`,
        source: newConnection.source,
        target: newConnection.target
      });
    }
  }, [removeEdge, addEdge]);




  const onEdgesChange = useCallback((changes: any) => {
    changes.forEach((change: any) => {
      if (change.type === 'remove') {
        removeEdge(change.id);
      }
    });
  }, [removeEdge]);

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
    <div className="flex-1 h-full">
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
        fitView    >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <div className="flex gap-2">
            <button 
              onClick={() => useWorkflowStore.getState().undo()}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200" >
              Undo
            </button>
            <button 
              onClick={() => useWorkflowStore.getState().redo()}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"  >
              Redo
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Canvas;

