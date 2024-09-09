import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import ChatGPTButton from "./components/GoogleGeminiButton";
import PomodoroTimer from "./components/PomodoroTimer";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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
    <Router>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Task Manager</h1>
        <TaskForm addTask={addTask} />
        <nav className="my-4">
          <NavLink to="/" className="mr-4">
            All
          </NavLink>
          <NavLink to="/completed" className="mr-4">
            Completed
          </NavLink>
          <NavLink to="/pending" className="mr-4">
            Pending
          </NavLink>
          <NavLink to="/pomodoro" className="mr-4">
            Pomodoro
          </NavLink>
          <NavLink to="/chatgpt" className="mr-4">
            Asking
          </NavLink>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <TaskList
                tasks={tasks}
                filter="all"
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
              />
            }
          />
          <Route
            path="/completed"
            element={
              <TaskList
                tasks={tasks}
                filter="completed"
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
              />
            }
          />
          <Route
            path="/pending"
            element={
              <TaskList
                tasks={tasks}
                filter="pending"
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
              />
            }
          />
          <Route path="/pomodoro" element={<PomodoroTimer />} />
          <Route path="/chatgpt" element={<ChatGPTButton />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
