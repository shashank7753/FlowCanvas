// import React from 'react';
// import { Circle, Square, Diamond, Play, AlertCircle } from 'lucide-react';
// import { NodeType } from '../types/workflow';

// interface NodeTypeItem {
//   type: NodeType;
//   label: string;
//   icon: React.ReactNode;
// }

// const nodeTypes: NodeTypeItem[] = [
//   { type: 'start', label: 'Start', icon: <Play className="w-4 h-4" /> },
//   { type: 'task', label: 'Task', icon: <Square className="w-4 h-4" /> },
//   { type: 'decision', label: 'Decision', icon: <Diamond className="w-4 h-4" /> },
//   { type: 'end', label: 'End', icon: <Circle className="w-4 h-4" /> },
// ];

// interface SidebarProps {
//   onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
//   return (
//     <div className="w-64 bg-white border-r border-gray-200 p-4">
//       <h2 className="text-lg font-semibold mb-4">Node Types</h2>
//       <div className="space-y-2">
//         {nodeTypes.map(({ type, label, icon }) => (
//           <div
//             key={type}
//             draggable
//             onDragStart={(e) => onDragStart(e, type)}
//             className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-move" >
//             {icon}
//             <span>{label}</span>
//           </div>
//         ))}
//       </div>
      
//       <div className="mt-8">
//         <h2 className="text-lg font-semibold mb-4">Validation</h2>
//         <div className="p-3 bg-yellow-50 rounded-md">
//           <div className="flex items-center gap-2">
//             <AlertCircle className="w-4 h-4 text-yellow-600" />
//             <span className="text-sm text-yellow-700">Workflow Validation</span>
//           </div>
//           <ul className="mt-2 text-sm text-yellow-600 list-disc list-inside">
//             <li>Must have one Start node</li>
//             <li>Must have at least one End node</li>
//             <li>All nodes must be connected</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import React, { useState } from 'react';
import { Circle, Square, Diamond, Play, AlertCircle, Trash2, Trash, Settings, Menu, X } from 'lucide-react';
import { NodeType } from '../types/workflow';

interface NodeTypeItem {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
}

const nodeTypes: NodeTypeItem[] = [
  { type: 'start', label: 'Start', icon: <Play className="w-4 h-4" /> },
  { type: 'task', label: 'Task', icon: <Square className="w-4 h-4" /> },
  { type: 'decision', label: 'Decision', icon: <Diamond className="w-4 h-4" /> },
  { type: 'end', label: 'End', icon: <Circle className="w-4 h-4" /> },
];

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
  onRemoveNode: () => void;
  onRemoveEdge: () => void;
  onSettingsClick: () => void;
  selectedNode: NodeType | null;
  onUpdateNodeProperties: (name: string, executionTime: number, type: NodeType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onDragStart,
  onRemoveNode,
  onRemoveEdge,
  onSettingsClick,
  selectedNode,
  onUpdateNodeProperties
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nodeName, setNodeName] = useState<string>(selectedNode || '');
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [nodeType, setNodeType] = useState<NodeType>(selectedNode || 'task');

  const handleUpdateNode = () => {
    if (selectedNode) {
      onUpdateNodeProperties(nodeName, executionTime, nodeType);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarContent = (
    <>
      <h2 className="text-lg font-semibold mb-4">Node Types</h2>
      <div className="space-y-2">
        {nodeTypes.map(({ type, label, icon }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-move"
          >
            {icon}
            <span>{label}</span>
          </div>
        ))}
      </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700">Node Type</label>
              <select
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value as NodeType)}
                className="mt-1 p-2 w-full border rounded-md"
              >
                {nodeTypes.map(({ type, label }) => (
                  <option key={type} value={type}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleUpdateNode}
              className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              Update Node
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <button
          onClick={onRemoveNode}
          className="flex items-center gap-2 w-full px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          <Trash className="w-4 h-4" />
          <span>Remove Node</span>
        </button>

        <button
          onClick={onRemoveEdge}
          className="flex items-center gap-2 w-full px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          <Trash2 className="w-4 h-4" />
          <span>Remove Edge</span>
        </button>

        <button
          onClick={onSettingsClick}
          className="flex items-center gap-2 w-full px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 p-4 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;