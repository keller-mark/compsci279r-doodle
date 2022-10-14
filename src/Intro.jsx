import { useState, useCallback, useMemo } from 'react';
import App, { STATE } from './App'

// Hard-code the event details, participant names, and the time slots.
const organizer = 'Jane Doe';
// Store a list of participant names who have already filled out the poll.
const friends = [
  'Jane Doe',
  'John Doe',
];
// Store a list of time slot objects.
const timeslots = [
  {
    // Use the JS date object.
    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    start: new Date("January 2, 2023 04:00:00"),
    end: new Date("January 2, 2023 08:00:00"),
    states: {
      // Store the selection of each participant for this time slot.
      'John Doe': STATE.YES,
      'Jane Doe': STATE.NO,
    }
  },
  {
    start: new Date("January 3, 2023 10:00:00"),
    end: new Date("January 3, 2023 12:00:00"),
    states: {
      'John Doe': STATE.NO,
      'Jane Doe': STATE.NO,
    }
  },
  {
    start: new Date("January 3, 2023 12:00:00"),
    end: new Date("January 3, 2023 13:00:00"),
    states: {
      'John Doe': STATE.YES,
      'Jane Doe': STATE.YES,
    }
  },
  {
    start: new Date("January 4, 2023 13:00:00"),
    end: new Date("January 4, 2023 15:00:00"),
    states: {
      'John Doe': STATE.NO,
      'Jane Doe': STATE.MAYBE,
    }
  },
  {
    start: new Date("January 5, 2022 10:00:00"),
    end: new Date("January 5, 2022 15:00:00"),
    states: {
      'John Doe': STATE.NO,
      'Jane Doe': STATE.MAYBE,
    }
  }
];

export default function Intro() {
  const [currTask, setCurrTask] = useState(0);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [prevTask, setPrevTask] = useState();
  // TODO: render user selections after task is done
  const [userSelections, setUserSelections] = useState();

  const startTask1 = useCallback(() => {
    setStartTime(Date.now());
    setCurrTask(1);
  }, []);
  const startTask2 = useCallback(() => {
    setStartTime(Date.now());
    setCurrTask(2);
  }, []);

  const clearTask = useCallback((selections) => {
    setEndTime(Date.now());
    setPrevTask(currTask);
    setUserSelections(selections);
    setCurrTask(0);
  }, [startTime]);

  const message = useMemo(() => {
    if(prevTask === null || prevTask === undefined) {
      return 'No previous task';
    }
    const delta = endTime - startTime;
    return `Previous task ${prevTask} took ${Math.floor(delta / 1000)} seconds`;
  }, [endTime]);

  return (
    <div>
      {currTask < 1 ? (
        <div>
          <p>{message}</p>
          <p>
            <button onClick={startTask1}>Task 1</button>
            <button onClick={startTask2}>Task 2</button>
          </p>
        </div>
      ) : null}
      {currTask === 1 ? (
        <App
          organizer={organizer}
          friends={friends}
          timeslots={timeslots}
          clearTask={clearTask}
        />
      ) : null}
      {currTask === 2 ? (
        <App
          organizer={organizer}
          friends={friends}
          timeslots={timeslots}
          clearTask={clearTask}
        />
      ) : null}
    </div>
  );
}