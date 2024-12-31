import React from 'react';
import { Circle, Square, Diamond, Play, AlertCircle } from 'lucide-react';
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
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Node Types</h2>
      <div className="space-y-2">
        {nodeTypes.map(({ type, label, icon }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-move" >
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
    </div>
  );
};

export default Sidebar;