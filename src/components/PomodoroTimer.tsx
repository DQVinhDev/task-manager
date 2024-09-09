import React, { useState, useEffect } from "react";

const PomodoroTimer: React.FC = () => {
  const [workTime, setWorkTime] = useState<number>(25); // Thời gian làm việc (phút)
  const [breakTime, setBreakTime] = useState<number>(5); // Thời gian nghỉ (phút)
  const [timeLeft, setTimeLeft] = useState<number>(workTime * 60); // Thời gian còn lại (giây)
  const [isWorking, setIsWorking] = useState<boolean>(true); // Trạng thái đang làm việc hay nghỉ ngơi
  const [isRunning, setIsRunning] = useState<boolean>(false); // Trạng thái chạy/ dừng của đồng hồ

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000); // Đếm ngược thời gian
    } else if (timeLeft === 0) {
      if (isWorking) {
        setTimeLeft(breakTime * 60); // Chuyển sang nghỉ khi hết giờ làm việc
      } else {
        setTimeLeft(workTime * 60); // Chuyển lại sang làm việc khi hết giờ nghỉ
      }
      setIsWorking(!isWorking);
    }
    return () => clearTimeout(timer); // Clear timer khi component unmount hoặc reset
  }, [isRunning, timeLeft, isWorking, workTime, breakTime]);

  const handleStartStop = () => {
    setIsRunning(!isRunning); // Chuyển trạng thái chạy/dừng của đồng hồ
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(workTime * 60); // Đặt lại thời gian khi reset
    setIsWorking(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // Hiển thị thời gian dưới dạng phút:giây
  };

  return (
    <div className="pomodoro-container">
      <h2 className="text-xl font-bold mb-4">Pomodoro Timer</h2>
      <div className="mb-4">
        <label>Work Time: </label>
        <input
          type="number"
          value={workTime}
          onChange={(e) => setWorkTime(parseInt(e.target.value))}
          className="border p-1 w-16"
        />{" "}
        minutes
      </div>
      <div className="mb-4">
        <label>Break Time: </label>
        <input
          type="number"
          value={breakTime}
          onChange={(e) => setBreakTime(parseInt(e.target.value))}
          className="border p-1 w-16"
        />{" "}
        minutes
      </div>
      <div className="text-3xl mb-4">
        {formatTime(timeLeft)} {/* Hiển thị thời gian đếm ngược */}
      </div>
      <button
        onClick={handleStartStop}
        className="bg-blue-500 text-white p-2 mr-2"
      >
        {isRunning ? "Pause" : "Start"} {/* Nút bắt đầu/dừng */}
      </button>
      <button onClick={handleReset} className="bg-red-500 text-white p-2">
        Reset {/* Nút đặt lại */}
      </button>
    </div>
  );
};

export default PomodoroTimer;
