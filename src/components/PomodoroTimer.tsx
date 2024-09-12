import React, { useState, useEffect, useCallback } from "react";
import styles from './PomodoroTimer.module.scss';

interface PomodoroState {
  workTime: number;
  breakTime: number;
  timeLeft: number;
  isWorking: boolean;
  isRunning: boolean;
  lastUpdateTime: number | null;
}

const PomodoroTimer: React.FC = () => {
  const [state, setState] = useState<PomodoroState>(() => {
    const savedState = localStorage.getItem('pomodoroState');
    return savedState ? JSON.parse(savedState) : {
      workTime: 25,
      breakTime: 5,
      timeLeft: 25 * 60,
      isWorking: true,
      isRunning: false,
      lastUpdateTime: null
    };
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const updateTimer = useCallback(() => {
    setState(prevState => {
      if (!prevState.isRunning || !prevState.lastUpdateTime) return prevState;

      const now = Date.now();
      const elapsedSeconds = Math.floor((now - prevState.lastUpdateTime) / 1000);
      if (elapsedSeconds === 0) return prevState;

      let newTimeLeft = Math.max(0, prevState.timeLeft - elapsedSeconds);
      let newIsWorking = prevState.isWorking;

      if (newTimeLeft === 0) {
        newIsWorking = !newIsWorking;
        newTimeLeft = (newIsWorking ? prevState.workTime : prevState.breakTime) * 60;
        
        // Hiển thị popup khi chuyển đổi giữa làm việc và nghỉ ngơi
        setPopupMessage(newIsWorking ? "Đã hết giờ nghỉ! Bắt đầu làm việc." : "Đã hết giờ làm việc! Bắt đầu nghỉ ngơi.");
        setShowPopup(true);
      }

      return {
        ...prevState,
        timeLeft: newTimeLeft,
        isWorking: newIsWorking,
        lastUpdateTime: now
      };
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [updateTimer]);

  useEffect(() => {
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }, [state]);

  const handleStartStop = () => {
    setState(prevState => ({
      ...prevState,
      isRunning: !prevState.isRunning,
      lastUpdateTime: prevState.isRunning ? null : Date.now()
    }));
  };

  const handleReset = () => {
    setState(prevState => ({
      ...prevState,
      timeLeft: prevState.workTime * 60,
      isWorking: true,
      isRunning: false,
      lastUpdateTime: null
    }));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className={styles.pomodoroContainer}>
      <h2>Pomodoro Timer</h2>
      <div className={styles.inputContainer}>
        <label>Thời gian làm việc: </label>
        <input
          type="number"
          value={state.workTime}
          onChange={(e) => setState(prevState => ({ ...prevState, workTime: parseInt(e.target.value) }))}
        />
        phút
      </div>
      <div className={styles.inputContainer}>
        <label>Thời gian nghỉ: </label>
        <input
          type="number"
          value={state.breakTime}
          onChange={(e) => setState(prevState => ({ ...prevState, breakTime: parseInt(e.target.value) }))}
        />
        phút
      </div>
      <div className={styles.timer}>
        {formatTime(state.timeLeft)}
      </div>
      <div className={styles.buttonContainer}>
        <button
          onClick={handleStartStop}
          className={styles.startStop}
        >
          {state.isRunning ? "Tạm dừng" : "Bắt đầu"}
        </button>
        <button onClick={handleReset} className={styles.reset}>
          Đặt lại
        </button>
      </div>
      
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
