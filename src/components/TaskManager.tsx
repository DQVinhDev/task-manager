import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  momentLocalizer,
  EventPropGetter,
  SlotInfo,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  note?: string;
}

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

const localizer = momentLocalizer(moment);

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents
      ? JSON.parse(savedEvents).map((event: Event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))
      : [];
  });
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending">(
    "all"
  );
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    title: "",
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    note: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

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

  const exportData = () => {
    const data = {
      tasks: tasks,
      events: events,
      notes: notes,
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "task_manager_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          if (data.tasks) setTasks(data.tasks);
          if (data.events) {
            setEvents(
              data.events.map((event: Event) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
              }))
            );
          }
          if (data.notes) setNotes(data.notes);
        } catch (error) {
          console.error("Error parsing imported data:", error);
          alert("Lỗi khi nhập dữ liệu. Vui lòng kiểm tra file và thử lại.");
        }
      };
      reader.readAsText(file);
    }
  };

  const eventPropGetter: EventPropGetter<Event> = (event) => {
    const backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(
      16
    )}`;
    return {
      style: {
        backgroundColor,
        border: "none",
        borderRadius: "5px",
        opacity: 0.8,
        color: "#fff",
        display: "block",
        fontWeight: 600,
      },
    };
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedDate(slotInfo.start);
    setNewEvent({
      id: 0,
      title: "",
      start: slotInfo.start,
      end: moment(slotInfo.start).add(1, "hour").toDate(),
      note: "",
    });
    setShowEventForm(true);
  };

  const handleEventCreate = () => {
    if (newEvent.title && newEvent.start < newEvent.end) {
      const overlappingEvent = events.find(
        (event) =>
          (newEvent.start >= event.start && newEvent.start < event.end) ||
          (newEvent.end > event.start && newEvent.end <= event.end) ||
          (newEvent.start <= event.start && newEvent.end >= event.end)
      );

      if (overlappingEvent) {
        alert(
          "Sự kiện này trùng thời gian với một sự kiện khác. Vui lòng chọn thời gian khác."
        );
        return;
      }

      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setShowEventForm(false);
      setNewEvent({
        id: 0,
        title: "",
        start: new Date(),
        end: new Date(new Date().setHours(new Date().getHours() + 1)),
        note: "",
      });
    } else {
      alert(
        "Vui lòng nhập tên sự kiện và đảm bảo thời gian kết thúc sau thời gian bắt đầu."
      );
    }
  };

  const handleEventDelete = (eventId: number) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseEventInfo = () => {
    setSelectedEvent(null);
  };

  const handleDeleteSelectedEvent = () => {
    if (selectedEvent) {
      handleEventDelete(selectedEvent.id);
      setSelectedEvent(null);
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now(),
        content: newNote.trim(),
        createdAt: new Date(),
      };
      setNotes([...notes, note]);
      setNewNote("");
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div>
      <div className="my-4">
        {["all", "completed", "pending"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "all" | "completed" | "pending")}
            className={`mr-2 ${activeTab === tab ? "font-bold" : ""}`}
          >
            {tab === "all" ? "All" : tab === "completed" ? "Done" : "Pending"}
          </button>
        ))}
      </div>
      <TaskForm addTask={addTask} />

      <TaskList
        tasks={tasks}
        filter={activeTab}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
      />

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">Note</h3>
        <div className="mb-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add note"
            className="border p-2 w-full"
            rows={3}
          />
          <button
            onClick={addNote}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add note
          </button>
        </div>
        <ul className="list-disc pl-5">
          {notes.map((note) => (
            <li key={note.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p>{note.content}</p>
                  <small className="text-gray-500">
                    {moment(note.createdAt).format("DD/MM/YYYY HH:mm")}
                  </small>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-500"
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 relative">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventPropGetter}
          views={["month", "week", "day"]}
          step={60}
          showMultiDayTimes
          defaultDate={new Date()}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
        />

        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h4 className="text-lg font-bold mb-2">Thêm sự kiện mới</h4>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                placeholder="Tên sự kiện"
                className="border p-2 mb-2 w-full"
              />
              <input
                type="datetime-local"
                value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, start: new Date(e.target.value) })
                }
                className="border p-2 mb-2 w-full"
              />
              <input
                type="datetime-local"
                value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, end: new Date(e.target.value) })
                }
                className="border p-2 mb-2 w-full"
              />
              <textarea
                value={newEvent.note}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, note: e.target.value })
                }
                placeholder="Ghi chú"
                className="border p-2 mb-2 w-full"
                rows={3}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleEventCreate}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Thêm sự kiện
                </button>
                <button
                  onClick={() => setShowEventForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
              <h4 className="text-lg font-bold mb-2">Thông tin sự kiện</h4>
              <p>
                <strong>Tên sự kiện:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>Bắt đầu:</strong>{" "}
                {moment(selectedEvent.start).format("DD/MM/YYYY HH:mm")}
              </p>
              <p>
                <strong>Kết thúc:</strong>{" "}
                {moment(selectedEvent.end).format("DD/MM/YYYY HH:mm")}
              </p>
              {selectedEvent.note && (
                <p>
                  <strong>Ghi chú:</strong> {selectedEvent.note}
                </p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleDeleteSelectedEvent}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                  Xóa sự kiện
                </button>
                <button
                  onClick={handleCloseEventInfo}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">Xuất/Nhập dữ liệu</h3>
        <div className="flex space-x-4">
          <button
            onClick={exportData}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Xuất dữ liệu
          </button>
          <div>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Nhập dữ liệu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
