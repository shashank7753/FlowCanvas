import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import useWorkflowStore from '../store/workflowStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics: React.FC = () => {
  const { nodes } = useWorkflowStore();

  const executionTimeData = {
    labels: nodes.map((node) => node.data.label),
    datasets: [
      {
        label: 'Execution Time',
        data: nodes.map((node) => node.data.executionTime),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const cumulativeTimeData = {
    labels: nodes.map((node) => node.data.label),
    datasets: [
      {
        label: 'Cumulative Time',
        data: nodes.reduce(
          (acc: number[], node) => [
            ...(acc.length ? acc : []),
            (acc[acc.length - 1] || 0) + node.data.executionTime,
          ],
          []
        ),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const nodeTypeData = {
    labels: ['Start', 'Task', 'Decision', 'End'],
    datasets: [
      {
        data: ['start', 'task', 'decision', 'end'].map(
          (type) => nodes.filter((node) => node.type === type).length
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Execution Time by Node</h3>
          <Bar data={executionTimeData} />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Cumulative Execution Time</h3>
          <Line data={cumulativeTimeData} />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Node Type Distribution</h3>
          <Pie data={nodeTypeData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;