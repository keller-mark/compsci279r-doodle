import { useState, useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { YesIcon, MaybeIcon, NoIcon, PendingIcon, GroupIcon, DescriptionIcon, GlobeIcon, PlaceIcon } from './icons';

const friends = [
  'John Doe',
  'Jane Doe',
];
const timeslots = [
  {
    start: new Date("September 21, 2022 04:00:00"),
    end: new Date("September 21, 2022 08:00:00"),
    states: {
      'John Doe': 0,
      'Jane Doe': 0,
    }
  }
];

function YouTimeCol(props) {
  const {
    start,
    end,
  } = props;

  const colRef = useRef();
  const [checkState, setCheckState] = useState(0);

  useEffect(() => {
    function clickHandler(event) {
      setCheckState(prev => (prev + 1) % 3);
    }
    if(colRef.current) {
      colRef.current.addEventListener('click', clickHandler);
    }
    return () => {
      colRef.current.removeEventListener('click', clickHandler);
    }
  }, [colRef]);
  return (
    <div className="datetime-col" ref={colRef}>
      <span>Wed</span><span>28</span><span>Sep</span><span>10:00 AM</span><span>2:00 PM</span>
      <span className="grow-el"></span>
      <Checkbox checkState={checkState} />
    </div>
  );
}

function FriendTimeCol(props) {
  const {
    checkState,
  } = props;

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
  const isDisabled = false;
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

function App() {
  return (
    <div>
      <h1>Doodle</h1>
      <div className="app">
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
                <span>5 options</span>
                <button>&larr;</button>
                <button>&rarr;</button>
              </div>
            </div>

          </div>
          <div className="options-body">
            <div className="you-row options-row">
              <div className="name-col">
                <span className="grow-el"></span>
                <span>You</span>
              </div>
              <div className="datetime-col">
                <span>Wed</span><span>21</span><span>Sep</span><span>4:00 AM</span><span>8:00 AM</span>
                <span className="grow-el"></span>
                <input type="checkbox" disabled title="You can't select a time that's in the past."/>
              </div>
              <YouTimeCol />
            </div>
            <div className="summary-row options-row">
              <div className="name-col">
                
              </div>
              <div className="datetime-col">
                <span className="info-icon"><YesIcon/> 0</span>
              </div>
              <div className="datetime-col">
                <span className="info-icon"><YesIcon/> 0</span>
              </div>
            </div>
            <div className="friend-row options-row">
              <div className="name-col">
                <span className="name">Mark Keller</span>
                <span>Organizer</span>
              </div>
              <FriendTimeCol checkState={0} />
              <FriendTimeCol checkState={2} />
            </div>
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
