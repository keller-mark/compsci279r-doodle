import { useState, useCallback, useMemo } from 'react';
import App from './App'
import { TASK_REV, TASK, t1_jan2, t1_jan9, t2_nextweek, t2_twoweeks } from './timeslots';

// Hard-code the event details, participant names, and the time slots.
const organizer = 'Mark';
// Store a list of participant names who have already filled out the poll.
const friends = [
  'Mark',
  'Elena',
  'Priyan',
];


export default function Intro() {
  const [currTask, setCurrTask] = useState(TASK.NONE);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [prevTask, setPrevTask] = useState();
  // TODO: render user selections after task is done
  const [userSelections, setUserSelections] = useState();

  const startTask = useCallback((taskType) => {
    setStartTime(Date.now());
    setCurrTask(taskType);
  }, []);

  const clearTask = useCallback((selections) => {
    setUserSelections(selections);
    setEndTime(Date.now());
    setPrevTask(currTask);
    setCurrTask(TASK.NONE);
  }, [startTime]);

  const message = useMemo(() => {
    if(prevTask === null || prevTask === undefined) {
      return 'No previous task';
    }
    const delta = endTime - startTime;
    return (
      <>
        <div>Previous task {TASK_REV[prevTask]} took {Math.floor(delta / 1000)} seconds</div>
        <pre>{JSON.stringify(userSelections, null, 2)}</pre>
      </>
    );
  }, [endTime]);

  return (
    <div>
      {currTask === TASK.NONE ? (
        <div>
          <p>{message}</p>
          <p>
            <button onClick={() => startTask(TASK.T1_W1)}>Task 1 (Jan 2)</button>
            <button onClick={() => startTask(TASK.T2_W1)}>Task 2 (next week)</button>
            <br/><br/>
            <button onClick={() => startTask(TASK.T1_W2)}>Task 1 (Jan 9)</button>
            <button onClick={() => startTask(TASK.T2_W2)}>Task 2 (two weeks)</button>
          </p>
        </div>
      ) : null}
      {currTask === TASK.T1_W1 ? (
        <App
          organizer={organizer}
          friends={friends}
          timeslots={t1_jan2}
          clearTask={clearTask}
        />
      ) : null}
      {currTask === TASK.T1_W2 ? (
        <App
          organizer={organizer}
          friends={friends}
          timeslots={t1_jan9}
          clearTask={clearTask}
        />
      ) : null}
      {currTask === TASK.T2_W1 ? (
        <App
          organizer={organizer}
          friends={friends}
          timeslots={t2_nextweek}
          clearTask={clearTask}
        />
      ) : null}
      {currTask === TASK.T2_W2 ? (
        <App
        organizer={organizer}
          friends={friends}
          timeslots={t2_twoweeks}
          clearTask={clearTask}
        />
      ) : null}
    </div>
  );
}