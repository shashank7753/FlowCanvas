import React, { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Analytics from './components/Analytics';
import useWorkflowStore from './store/workflowStore';

function App() {
  const { loadWorkflow } = useWorkflowStore();

  useEffect(() => {
    const savedWorkflow = localStorage.getItem('workflow-state');
    if (savedWorkflow) {
      loadWorkflow(JSON.parse(savedWorkflow));
    }
  }, [loadWorkflow]);

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onDragStart={handleDragStart} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </div>
        <div className="h-1/3 overflow-auto border-t border-gray-200">
          <Analytics />
        </div>
      </div>
    </div>
  );
}

export default App;