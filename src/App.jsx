import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import sum from 'lodash/sum';
import { YesIcon, MaybeIcon, NoIcon, PendingIcon, GroupIcon, DescriptionIcon, GlobeIcon, PlaceIcon } from './icons';

// Set up constants to convert numeric days of the week to short strings.
const days = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
];
// Set up constants to convert numeric months to short strings.
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const organizer = 'Jane Doe';

const friends = [
  'Jane Doe',
  'John Doe',
];
const timeslots = [
  {
    start: new Date("September 21, 2022 04:00:00"),
    end: new Date("September 21, 2022 08:00:00"),
    states: {
      'John Doe': 1,
      'Jane Doe': 0,
    }
  },
  {
    start: new Date("December 24, 2022 10:00:00"),
    end: new Date("December 24, 2022 12:00:00"),
    states: {
      'John Doe': 0,
      'Jane Doe': 0,
    }
  },
  {
    start: new Date("December 24, 2022 12:00:00"),
    end: new Date("December 24, 2022 13:00:00"),
    states: {
      'John Doe': 1,
      'Jane Doe': 1,
    }
  },
  {
    start: new Date("December 25, 2022 13:00:00"),
    end: new Date("December 25, 2022 15:00:00"),
    states: {
      'John Doe': 0,
      'Jane Doe': 2,
    }
  },
  {
    start: new Date("December 26, 2022 10:00:00"),
    end: new Date("December 26, 2022 15:00:00"),
    states: {
      'John Doe': 0,
      'Jane Doe': 2,
    }
  }
];

function YouTimeCol(props) {
  const {
    start,
    end,
  } = props;

  const isDisabled = start < (new Date());
  const shortTime = new Intl.DateTimeFormat("en", {
    timeStyle: "short"
  });

  const colRef = useRef();
  const [checkState, setCheckState] = useState(0);

  useEffect(() => {
    function clickHandler(event) {
      if(!isDisabled) {
        setCheckState(prev => (prev + 1) % 3);
      }
    }
    if(colRef.current) {
      colRef.current.addEventListener('click', clickHandler);
    }
    return () => {
      if(!colRef.current) {
        return;
      }
      colRef.current.removeEventListener('click', clickHandler);
    }
  }, [colRef, isDisabled]);
  return (
    <div className="datetime-col" ref={colRef}>
      <span>{days[start.getDay()]}</span><span>{start.getDate()}</span><span>{months[start.getMonth()]}</span><span>{shortTime.format(start)}</span><span>{shortTime.format(end)}</span>
      <span className="grow-el"></span>
      <Checkbox checkState={checkState} isDisabled={isDisabled} />
    </div>
  );
}

function SummaryTimeCol(props) {
  const {
    start,
    states
  } = props;

  const isDisabled = start < (new Date());

  return (
    <div className={clsx("datetime-col", "summary-num", { disabled: isDisabled })}>
      <span className="info-icon"><YesIcon/> {sum(Object.values(states).map(v => v > 0 ? 1 : 0))}</span>
    </div>
  );
}

function FriendTimeCol(props) {
  const {
    start,
    checkState,
  } = props;

  const isDisabled = start < (new Date());

  const stateToComponent = {
    0: <NoIcon/>,
    1: <YesIcon/>,
    2: <MaybeIcon/>,
  };
  const stateToClassName = {
    0: "no-primary",
    1: "yes-primary",
    2: "maybe-primary",
  };
  return (
    <div className="datetime-col">
      <span className={clsx("checkstate", stateToClassName[checkState], { disabled: isDisabled })}>
        {stateToComponent[checkState]}
      </span>
    </div>
  )
}

function Checkbox(props) {
  const {
    isDisabled,
    checkState,
  } = props;

  const stateToComponent = {
    0: <span/>,
    1: <YesIcon/>,
    2: <MaybeIcon/>,
  };
  const stateToClassName = {
    0: "",
    1: "yes-secondary",
    2: "maybe-secondary",
  };

  return (
    <span className={clsx("checkbox", stateToClassName[checkState], { disabled: isDisabled })}>
      {stateToComponent[checkState]}
    </span>
  )
}

function EventInfo() {
  return (
    <div className="event-info">
      <p><span className="name">Mark Keller</span> is organizing</p>
      <h3>Barbecue</h3>
      <h4><span className="info-icon"><PlaceIcon/></span>Boston</h4>
      <h4><span className="info-icon"><GlobeIcon/></span>United States - New York City</h4>
      <p><span className="info-icon"><DescriptionIcon/></span>This is a description of the barbecue.</p>
      <p><span className="info-icon"><GroupIcon/></span>1 of 1 invitee responded</p>
      <div>
        <div>
          <span className="info-icon-box yes-primary"><YesIcon/></span>
          <label>Yes (1 click)</label>
        </div>
        <div>
          <span className="info-icon-box maybe-primary"><MaybeIcon/></span>
          <label>If need be (2 clicks)</label>
        </div>
        <div>
          <span className="info-icon-box no-primary"><NoIcon/></span>
          <label>No</label>
        </div>
        <div>
          <span className="info-icon-box no-primary"><PendingIcon/></span>
          <label>Pending (yet to vote)</label>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Doodle</h1>
      <div className="app">
        <EventInfo/>
        <div className="options-container">
          <div className="options-header">
            <h2>Select your preferred times</h2>
            <p>We'll let you know when the organizer picks the best time</p>
            <div className="button-row">
              <div className="buttons-left">
                Order by <button disabled>Date</button> <button>Most popular</button>
              </div>
              <div className="buttons-middle"></div>
              <div className="buttons-right">
                <span>{timeslots.length} options</span>
                <button disabled>&larr;</button>
                <button disabled>&rarr;</button>
              </div>
            </div>

          </div>
          <div className="options-body">
            <div className="you-row options-row">
              <div className="name-col">
                <span className="grow-el"></span>
                <span>You</span>
              </div>
              {timeslots.map(timeslot => (
                <YouTimeCol key={timeslot.start} start={timeslot.start} end={timeslot.end} />
              ))}
            </div>
            <div className="summary-row options-row">
              <div className="name-col">
                
              </div>
              {timeslots.map((timeslot) => (
                <SummaryTimeCol key={timeslot.start} states={timeslot.states} start={timeslot.start} />
              ))}
            </div>
            {friends.map(friend => (
              <div className="friend-row options-row" key={friend}>
                <div className="name-col">
                  <span className="name">{friend}</span>
                  {friend === organizer ? (<span>Organizer</span>) : null}
                </div>
                {timeslots.map((timeslot => (
                  <FriendTimeCol key={timeslot.start} checkState={timeslot.states[friend]} start={timeslot.start} />
                )))}
              </div>
            ))}
          </div>
          <div className="options-footer">
            <div className="footer-row">
              You are the first participant to respond
            </div>
            <div className="footer-row">
              <span><button>Decline</button></span>
              <p>Selecting more times makes it easier to find the best option.</p>
              <span><button>Continue</button></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
