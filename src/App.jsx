import { useState, useEffect, useMemo } from 'react';

function App() {

  return (
    <div>
      <h1>Doodle</h1>
      <div className="app">
        <div className="event-info">
          <p><span className="name">Mark Keller</span> is organizing</p>
          <h3>Barbecue</h3>
          <h4>Boston</h4>
          <h4>United States - New York City</h4>
          <p>This is a description of the barbecue.</p>
          <div>
            <div>
              <input type="checkbox" checked disabled />
              <label>Yes (1 click)</label>
            </div>
            <div>
              <input type="checkbox" checked disabled />
              <label>If need be (2 clicks)</label>
            </div>
            <div>
              <input type="checkbox" disabled />
              <label>No</label>
            </div>
            <div>
              <input type="checkbox" disabled />
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
                Order by <button>Date</button> <button>Most popular</button>
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
              <div className="datetime-col">
                <span>Wed</span><span>28</span><span>Sep</span><span>10:00 AM</span><span>2:00 PM</span>
                <span className="grow-el"></span>
                <input type="checkbox"/>
              </div>
            </div>
            <div className="summary-row options-row">
              <div className="name-col">
                
              </div>
              <div className="datetime-col">
                <span>&#10003; 0</span>
              </div>
              <div className="datetime-col">
                <span>&#10003; 0</span>
              </div>
            </div>
            <div className="friend-row options-row">
              <div className="name-col">
                <span className="name">Mark Keller</span>
                <span>Organizer</span>
              </div>
              <div className="datetime-col">
                <input type="checkbox" disabled checked />
              </div>
              <div className="datetime-col">
                <input type="checkbox" disabled />
              </div>
            </div>
          </div>
          <div className="options-footer">
            <div className="footer-row">
              You are the first participant to respond
            </div>
            <div className="footer-row">
              <button>Decline</button>
              <p>Selecting more times makes it easier to find the best option.</p>
              <button>Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
