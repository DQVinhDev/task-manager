import { createStore, combineReducers } from 'redux';
import pomodoroReducer from './reducers/pomodoroReducer';

const rootReducer = combineReducers({
  pomodoro: pomodoroReducer,
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
export default store;