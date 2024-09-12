import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending'>('all');

  const addTask = (task: string) => {
    const newTask: Task = {
      id: tasks.length + 1,
      text: task,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Task Manager</h2>
      <TaskForm addTask={addTask} />
      <div className="my-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`mr-2 ${activeTab === 'all' ? 'font-bold' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`mr-2 ${activeTab === 'completed' ? 'font-bold' : ''}`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`mr-2 ${activeTab === 'pending' ? 'font-bold' : ''}`}
        >
          Pending
        </button>
      </div>
      <TaskList
        tasks={tasks}
        filter={activeTab}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
      />
    </div>
  );
};

export default TaskManager;