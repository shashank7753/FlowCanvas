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
        backgroundColor: 'rgba(53, 162, 235, 0.7)',
        hoverBackgroundColor: 'rgba(53, 162, 235, 1)',
        borderRadius: 5,
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
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointRadius: 5,
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
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuad' as const,
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Workflow Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-center">Execution Time by Node</h3>
          <div className="relative h-60">
            <Bar data={executionTimeData} options={chartOptions} />
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-center">Cumulative Execution Time</h3>
          <div className="relative h-60">
            <Line data={cumulativeTimeData} options={chartOptions} />
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-center">Node Type Distribution</h3>
          <div className="relative h-60">
            <Pie data={nodeTypeData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
