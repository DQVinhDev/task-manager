import React, { useState, useEffect, useRef } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: string) => {
    const newTask: Task = {
      id: Date.now(),
      text: task,
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const exportUncompletedTasks = () => {
    const uncompletedTasks = tasks.filter(task => !task.completed);
    const tasksText = uncompletedTasks.map(task => task.text).join('\n');
    const blob = new Blob([tasksText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uncompleted_tasks.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTasks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newTasks = content.split('\n').filter(line => line.trim() !== '').map(line => ({
          id: Date.now() + Math.random(),
          text: line.trim(),
          completed: false
        }));
        setTasks(prevTasks => [...prevTasks, ...newTasks]);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quản lý công việc</h2>
      <TaskForm addTask={addTask} />
      <div className="my-4">
        {["all", "completed", "pending"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "all" | "completed" | "pending")}
            className={`mr-2 ${activeTab === tab ? "font-bold" : ""}`}
          >
            {tab === "all" ? "Tất cả" : tab === "completed" ? "Hoàn thành" : "Đang chờ"}
          </button>
        ))}
      </div>
      <TaskList
        tasks={tasks}
        filter={activeTab}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
      />
      <div className="mt-4">
        <button onClick={exportUncompletedTasks} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
          export task
        </button>
        <input
          type="file"
          accept=".txt"
          onChange={importTasks}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current?.click()} className="bg-green-500 text-white px-4 py-2 rounded">
          import task
        </button>
      </div>
    </div>
  );
};

export default TaskManager;
