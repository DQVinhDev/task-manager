import React, { useState } from "react";

interface TaskFormProps {
  addTask: (task: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ addTask }) => {
  const [task, setTask] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      addTask(task);
      setTask("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="border p-2 w-full"
        placeholder="Add a new task"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 ml-2">
        Add
      </button>
    </form>
  );
};

export default TaskForm;
