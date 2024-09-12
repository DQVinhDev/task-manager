import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setWorkTime, setBreakTime, setTimeLeft, setIsWorking, setIsRunning } from "../redux/actions/pomodoroActions";
import styles from './PomodoroTimer.module.scss'; // Thêm dòng này nếu bạn sử dụng CSS modules

const PomodoroTimer: React.FC = () => {
  const dispatch = useDispatch();
  const { workTime, breakTime, timeLeft, isWorking, isRunning } = useSelector((state: any) => state.pomodoro);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => dispatch(setTimeLeft(timeLeft - 1)), 1000);
    } else if (timeLeft === 0) {
      if (isWorking) {
        dispatch(setTimeLeft(breakTime * 60));
      } else {
        dispatch(setTimeLeft(workTime * 60));
      }
      dispatch(setIsWorking(!isWorking));
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft, isWorking, workTime, breakTime, dispatch]);

  const handleStartStop = () => {
    dispatch(setIsRunning(!isRunning));
  };

  const handleReset = () => {
    dispatch(setIsRunning(false));
    dispatch(setTimeLeft(workTime * 60));
    dispatch(setIsWorking(true));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className={styles.pomodoroContainer}> {/* Sử dụng CSS module */}
      <h2>Pomodoro Timer</h2>
      <div className={styles.inputContainer}>
        <label>Work Time: </label>
        <input
          type="number"
          value={workTime}
          onChange={(e) => dispatch(setWorkTime(parseInt(e.target.value)))}
        />
        minutes
      </div>
      <div className={styles.inputContainer}>
        <label>Break Time: </label>
        <input
          type="number"
          value={breakTime}
          onChange={(e) => dispatch(setBreakTime(parseInt(e.target.value)))}
        />
        minutes
      </div>
      <div className={styles.timer}>
        {formatTime(timeLeft)} {/* Hiển thị thời gian đếm ngược */}
      </div>
      <div className={styles.buttonContainer}>
        <button
          onClick={handleStartStop}
          className={styles.startStop}
        >
          {isRunning ? "Pause" : "Start"} {/* Nút bắt đầu/dừng */}
        </button>
        <button onClick={handleReset} className={styles.reset}>
          Reset {/* Nút đặt lại */}
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
