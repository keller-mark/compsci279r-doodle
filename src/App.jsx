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

// Use a constant object to name the three possible checkbox state values.
export const STATE = {
  NO: 0,
  YES: 1,
  MAYBE: 2,
};

// Create a global time formatter object.
// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
const shortTime = new Intl.DateTimeFormat("en", {
  timeStyle: "short"
});


// Create a component to represent the "you" part of a timeslot column.
// (The clickable upper part of each column with the date/time and the checkbox).
function YouTimeCol(props) {
  const {
    // Take the start and end datetime as props.
    start,
    end,
  } = props;

  // Set this checkbox to disabled if the time slot
  // is in the past (has already occurred).
  const isDisabled = start < (new Date());

  // Set up a ref for the outer <div/> which will
  // allow us to attach an event handler on its
  // HTML element node.
  const colRef = useRef();
  // Store the state of this time slot,
  // and initialize it to the unavailable state.
  const [checkState, setCheckState] = useState(STATE.NO);

  // Use a React effect to set up the click handler
  // on the outer <div/>.
  useEffect(() => {
    // Create a click handler function.
    function clickHandler() {
      // Only allow the click to affect the state
      // if the time slot is not disabled.
      if(!isDisabled) {
        setCheckState(prev => (prev + 1) % 3);
      }
    }
    if(colRef.current) {
      // Add the event listener.
      colRef.current.addEventListener('click', clickHandler);
    }
    // In the cleanup function of the effect, remove the
    // event listener.
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

// Create a summary column component,
// to indicate the number of participants
// who are available (or maybe available) for the time slot.
function SummaryTimeCol(props) {
  const {
    start,
    states,
  } = props;

  // Check if the timeslot is in the past.
  const isDisabled = start < (new Date());
  // Compute the number of people who have indicated YES/MAYBE.
  const numAvailable = sum(Object.values(states).map(v => v > 0 ? 1 : 0));

  return (
    <div className={clsx("datetime-col", "summary-num", { disabled: isDisabled })}>
      <span className="info-icon"><YesIcon/> {numAvailable}</span>
    </div>
  );
}

// Create a component to represent the time slot column
// for others (to indicate to the user others' availability).
function FriendTimeCol(props) {
  const {
    start,
    checkState,
  } = props;

  // Check whether the time slot is in the past.
  const isDisabled = start < (new Date());

  // Store a mapping from the time slot state
  // to the icons and CSS classes to display.
  const stateToComponent = {
    [STATE.NO]: <NoIcon/>,
    [STATE.YES]: <YesIcon/>,
    [STATE.MAYBE]: <MaybeIcon/>,
  };
  const stateToClassName = {
    [STATE.NO]: "no-primary",
    [STATE.YES]: "yes-primary",
    [STATE.MAYBE]: "maybe-primary",
  };
  return (
    <div className="datetime-col">
      <span className={clsx("checkstate", stateToClassName[checkState], { disabled: isDisabled })}>
        {stateToComponent[checkState]}
      </span>
    </div>
  )
}

// Create a fake checkbox that has three different states
// (yes, no, maybe) plus a disabled modifier.
// This does not handle the click interaction
// because the outer component <YouTimeCol/>
// handles it and passes the state down,
// giving the user a larger click target.
function Checkbox(props) {
  const {
    isDisabled,
    checkState,
  } = props;

  // Store a mapping from the time slot state
  // to the icons and CSS classes to display.
  const stateToComponent = {
    [STATE.NO]: <span/>,
    [STATE.YES]: <YesIcon/>,
    [STATE.MAYBE]: <MaybeIcon/>,
  };
  const stateToClassName = {
    [STATE.NO]: "",
    [STATE.YES]: "yes-secondary",
    [STATE.MAYBE]: "maybe-secondary",
  };

  return (
    <span className={clsx("checkbox", stateToClassName[checkState], { disabled: isDisabled })}>
      {stateToComponent[checkState]}
    </span>
  )
}

// Create a component to render the event info in the left
// sidebar (description, organizer, time zone, etc).
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

// Define the top-level <App/> component
// which is exported and rendered from ./main.jsx.
function App(props) {
  const {
    organizer,
    friends,
    timeslots,
    clearTask,
  } = props;
  return (
    <div>
      {/* The app title */}
      <h1>Doodle</h1>
      <div className="app">
        {/* The left event info sidebar. */}
        <EventInfo/>
        {/* The right side contains the checkbox interactive interface. */}
        <div className="options-container">
          <div className="options-header">
            <h2>Select your preferred times</h2>
            <p>We'll let you know when the organizer picks the best time</p>
            {/* There is a row of buttons for ordering the time slots and navigating/pagination. These buttons do not have click handlers but would in a full-featured implementation. */}
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
          {/* The "body" of this right-hand side contains the time slot table. */}
          <div className="options-body">
            {/* The top row of the body displays the date, time, and a checkbox for each slot. */}
            <div className="you-row options-row">
              <div className="name-col">
                <span className="grow-el"/>
                <span>You</span>
              </div>
              {timeslots.map(timeslot => (
                <YouTimeCol key={timeslot.start} start={timeslot.start} end={timeslot.end} />
              ))}
            </div>
            {/* The middle row of the body displays the summary (number of people who are available) for each slot. */}
            <div className="summary-row options-row">
              <div className="name-col" />
              {timeslots.map((timeslot) => (
                <SummaryTimeCol key={timeslot.start} states={timeslot.states} start={timeslot.start} />
              ))}
            </div>
            {/* The remaining rows of the body display each person's availability for each slot. */}
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
          {/* The footer of the interface contains more buttons. These buttons do not have click handlers but would in a full-featured implementation. */}
          <div className="options-footer">
            <div className="footer-row">
              You are the first participant to respond
            </div>
            <div className="footer-row">
              <span><button>Decline</button></span>
              <p>Selecting more times makes it easier to find the best option.</p>
              <span><button onClick={clearTask}>Continue</button></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
