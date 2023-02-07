import "./style.css";
import parse from "date-fns/parse";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import DatePicker from "react-datepicker";

import startOfWeek from "date-fns/startOfWeek";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  getAllEvents,
  updateEvent,
  addEvents,
  deleteEvent,
  signOutUser,
} from "../services/firebase";
import AllMeetings from "./AllMeetings";
import Profile from "./Profile";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Home = () => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [isEditEnabled, setIsEditEnabled] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const getUserEvents = useCallback(async () => {
    const result = await getAllEvents(user.uid);

    if (result.length) {
      setEvents(
        result.map((event) => ({
          ...event,
          start: event.start.toDate(),
          end: event.end.toDate(),
        }))
      );
    }
  }, [user.uid]);

  useEffect(() => {
    getUserEvents();
  }, [getUserEvents]);

  const handleAddEvent = () => {
    const newEvent = {
      id: events.length + 1,
      title,
      start,
      end,
      allDay: true,
    };
    setEvents([newEvent, ...events]);
    addEvents(user.uid, newEvent);
    setTitle("");
    setStart("");
    setEnd("");
  };

  const onEditClickHandler = (event) => {
    setIsEditEnabled(true);
    setSelectedEvent(event);
    setTitle(event.title);
    setStart(event.start);
    setEnd(event.end);
    setEvents(events.filter((eventItem) => eventItem.id !== event.id));
  };

  const onSaveChangesClickHandler = () => {
    updateEvent(user.uid, selectedEvent.id, {
      title,
      start,
      end,
      allDay: true,
    });
    setEvents([{ ...selectedEvent, title, start, end }, ...events]);
    setIsEditEnabled(false);
    setTitle("");
    setStart("");
    setEnd("");
    setSelectedEvent({});
  };

  const onCancelSaveChanges = () => {
    setEvents([{ ...selectedEvent }, ...events]);
    setIsEditEnabled(false);
    setTitle("");
    setStart("");
    setEnd("");
    setSelectedEvent({});
  };

  const deleteEvents = async (id) => {
    console.log(id);
    await deleteEvent(user.uid, id);
    setEvents(events.filter((event) => event.id !== id));
  };

  const Logout = () => {
    signOutUser().then((data) => {
      localStorage.removeItem("user");
      navigate("/");
    });
  };

  return (
    <div className="calendar-container">
      <div className="nav-bar">
        <h1>Calendaly</h1>

        <Profile Logout={Logout} name={user} />
      </div>
      <div className="input-bar">
        <h2>Add new Event</h2>
        <input
          type="text"
          placeholder="Add Title"
          style={{ width: "20%", marginRight: "10px" }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="date-picker">
          <DatePicker
            placeholderText="Start Date"
            selected={start}
            onChange={(start) => setStart(start)}
          />
          <DatePicker
            placeholderText="End Date"
            selected={end}
            onChange={(end) => setEnd(end)}
          />
        </div>

        <button style={{ marginTop: "10px" }} onClick={handleAddEvent}>
          Add Event
        </button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400, margin: "50px" }}
      />
      <AllMeetings
        events={events}
        onEditClickHandler={onEditClickHandler}
        onSaveChangesClickHandler={onSaveChangesClickHandler}
        onCancelSaveChanges={onCancelSaveChanges}
        deleteEvents={deleteEvents}
        isEditEnabled={isEditEnabled}
      />
    </div>
  );
};

export default Home;
