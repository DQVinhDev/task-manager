import React from "react";

interface TaskListProps {
  tasks: Task[];
  filter: "all" | "completed" | "pending";
  toggleTaskCompletion: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  toggleTaskCompletion,
  deleteTask,
}) => {
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <ul className="list-disc">
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center mb-2">
            <span className={task.completed ? "line-through" : ""}>
              {task.text}
            </span>
            <div>
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className="mr-2"
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))
      ) : (
        <p>No tasks available.</p>
      )}
    </ul>
  );
};

export default TaskList;
