import { SET_WORK_TIME, SET_BREAK_TIME, SET_TIME_LEFT, SET_IS_WORKING, SET_IS_RUNNING } from '../actions/pomodoroActions';

const initialState = {
  workTime: 25,
  breakTime: 5,
  timeLeft: 25 * 60,
  isWorking: true,
  isRunning: false,
  lastUpdateTime: null
};

const pomodoroReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_WORK_TIME':
      return { ...state, workTime: action.payload };
    case 'SET_BREAK_TIME':
      return { ...state, breakTime: action.payload };
    case 'SET_TIME_LEFT':
      return { ...state, timeLeft: action.payload };
    case 'SET_IS_WORKING':
      return { ...state, isWorking: action.payload };
    case 'SET_IS_RUNNING':
      return { ...state, isRunning: action.payload };
    case 'SET_LAST_UPDATE_TIME':
      return { ...state, lastUpdateTime: action.payload };
    default:
      return state;
  }
};

export default pomodoroReducer;