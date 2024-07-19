import { ADD_TASK, MARK_DONE, REMOVE_TASK, SET_TASK, UPDATE_TASK } from "./TaskAction.types";

const TaskReducer = (state, action) => {
  console.log("Task reducer", action);
  switch (action.type) {
    case ADD_TASK: {
      const { _id, title, description } = action.payload;
      if (!_id || !title || !description) {
        console.error("Invalid payload for ADD_TASK:", action.payload);
        return state;
      }
      return [
        ...state,
        {
          _id,
          title,
          description,
          completed: false,
        },
      ];
    }
    case SET_TASK: {
      if (!Array.isArray(action.payload)) {
        console.error("Expected an array for SET_TASK payload, got:", action.payload);
        return state;
      }
      return action.payload.map(task => ({
        ...task,
        _id: task._id || 'unknown_id', // Provide a default value or handle the absence of _id
      }));
    }
    case REMOVE_TASK: {
      if (!action.payload) {
        console.error("Invalid payload for REMOVE_TASK:", action.payload);
        return state;
      }
      return state.filter((task) => task._id !== action.payload);
    }
    case MARK_DONE: {
      if (!action.payload) {
        console.error("Invalid payload for MARK_DONE:", action.payload);
        return state;
      }
      return state.map((task) => {
        if (task._id === action.payload) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    }
    case UPDATE_TASK: {
      const { _id } = action.payload;
      if (!_id) {
        console.error("Invalid payload for UPDATE_TASK:", action.payload);
        return state;
      }
      return state.map((task) =>
        task._id === _id ? { ...task, ...action.payload } : task
      );
    }
    default: {
      throw new Error("Unknown action type: " + action.type);
    }
  }
};

export default TaskReducer;
