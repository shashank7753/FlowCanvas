import React, { useState, useCallback } from 'react';
import { Circle, Square, Diamond, Play, AlertCircle, Menu, X, Download, Upload } from 'lucide-react';
import { NodeType, Workflow } from '../types/workflow';

interface NodeTypeItem {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
  onRemoveNode: () => void;
  onRemoveEdge: () => void;
  onSettingsClick: () => void;
  selectedNode: NodeType | null;
  onUpdateNodeProperties: (name: string, executionTime: number, type: NodeType) => void;
  workflow: Workflow;
  onImportWorkflow: (workflow: Workflow) => void;
}

const nodeTypes: NodeTypeItem[] = [
  { type: 'start', label: 'Start', icon: <Play className="w-4 h-4" /> },
  { type: 'task', label: 'Task', icon: <Square className="w-4 h-4" /> },
  { type: 'decision', label: 'Decision', icon: <Diamond className="w-4 h-4" /> },
  { type: 'end', label: 'End', icon: <Circle className="w-4 h-4" /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  onDragStart,
  selectedNode,
  onUpdateNodeProperties,
  workflow,
  onImportWorkflow
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nodeName, setNodeName] = useState<string>(selectedNode || '');
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [nodeType] = useState<NodeType>(selectedNode || 'task');

  const handleExport = useCallback(() => {
    const fileName = `workflow-${new Date().toISOString()}.json`;
    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [workflow]);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        onImportWorkflow(parsed);
      } catch (error) {
        console.error('Failed to import workflow:', error);
        alert('Failed to import workflow. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [onImportWorkflow]);

  const sidebarContent = (
    <>
      <h2 className="text-lg font-semibold mb-4">Node Types</h2>
      <div className="space-y-2">
        {nodeTypes.map(({ type, label, icon }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-move">
            {icon}
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Workflow Actions</h2>
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 w-full p-2 bg-blue-50 hover:bg-blue-100 rounded text-blue-600">
            <Download className="w-4 h-4" />
            Export Workflow
          </button>
          
          <label className="flex items-center gap-2 w-full p-2 bg-blue-50 hover:bg-blue-100 rounded text-blue-600 cursor-pointer">
            <Upload className="w-4 h-4" />
            Import Workflow
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      {/* Rest of your existing sidebar content */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Validation</h2>
        <div className="p-3 bg-yellow-50 rounded-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">Workflow Validation</span>
          </div>
          <ul className="mt-2 text-sm text-yellow-600 list-disc list-inside">
            <li>Must have one Start node</li>
            <li>Must have at least one End node</li>
            <li>All nodes must be connected</li>
          </ul>
        </div>
      </div>

      {selectedNode && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Edit Node</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Node Name</label>
              <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Execution Time</label>
              <input
                type="number"
                value={executionTime}
                onChange={(e) => setExecutionTime(Number(e.target.value))}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <button
              onClick={() => onUpdateNodeProperties(nodeName, executionTime, nodeType)}
              className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
              Update Node
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden">
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 p-4 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;