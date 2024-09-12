export const SET_WORK_TIME = 'SET_WORK_TIME';
export const SET_BREAK_TIME = 'SET_BREAK_TIME';
export const SET_TIME_LEFT = 'SET_TIME_LEFT';
export const SET_IS_WORKING = 'SET_IS_WORKING';
export const SET_IS_RUNNING = 'SET_IS_RUNNING';

export const setWorkTime = (time: number) => ({ type: SET_WORK_TIME, payload: time });
export const setBreakTime = (time: number) => ({ type: SET_BREAK_TIME, payload: time });
export const setTimeLeft = (time: number) => ({ type: SET_TIME_LEFT, payload: time });
export const setIsWorking = (isWorking: boolean) => ({ type: SET_IS_WORKING, payload: isWorking });
export const setIsRunning = (isRunning: boolean) => ({ type: SET_IS_RUNNING, payload: isRunning });