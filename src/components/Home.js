import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Tooltip,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import getDay from "date-fns/getDay";
import startOfWeek from "date-fns/startOfWeek";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  getAllEvents,
  updateEvent,
  addEvents,
  deleteEvent,
  signOutUser,
} from "../services/firebase";
import AllMeetings from "./AllMeetings";
import Profile from "./Profile";
import { Logout as LogoutIcon } from "@mui/icons-material";

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
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
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
    if (title && start && end) {
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
      setStart(null);
      setEnd(null);
    }
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
    setStart(null);
    setEnd(null);
    setSelectedEvent({});
  };

  const onCancelSaveChanges = () => {
    setEvents([{ ...selectedEvent }, ...events]);
    setIsEditEnabled(false);
    setTitle("");
    setStart(null);
    setEnd(null);
    setSelectedEvent({});
  };

  const deleteEvents = async (id) => {
    await deleteEvent(user.uid, id);
    setEvents(events.filter((event) => event.id !== id));
  };

  const Logout = () => {
    signOutUser().then(() => {
      localStorage.removeItem("user");
      navigate("/");
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={2}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Calendaly
        </Typography>
        <Box display="flex" alignItems="center">
          <Tooltip title="Logout">
            <IconButton onClick={Logout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
          <Avatar>{user?.name?.charAt(0).toUpperCase()}</Avatar>
        </Box>
      </Box>
      <Box width="100%" maxWidth="800px">
        <Typography variant="h6" gutterBottom>
          Add new Event
        </Typography>
        <TextField
          label="Add Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
            <DatePicker
              label="Start Date"
              value={start}
              onChange={(date) => setStart(date)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={end}
              onChange={(date) => setEnd(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </LocalizationProvider>
        <Button variant="contained" color="primary" onClick={handleAddEvent}>
          Add Event
        </Button>
      </Box>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400, margin: "50px 0" }}
      />
      <AllMeetings
        events={events}
        onEditClickHandler={onEditClickHandler}
        onSaveChangesClickHandler={onSaveChangesClickHandler}
        onCancelSaveChanges={onCancelSaveChanges}
        deleteEvents={deleteEvents}
        isEditEnabled={isEditEnabled}
      />
    </Box>
  );
};

export default Home;
