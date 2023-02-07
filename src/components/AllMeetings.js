import React, { useEffect, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

const AllMeetings = ({
  events,
  onEditClickHandler,
  onSaveChangesClickHandler,
  onCancelSaveChanges,
  deleteEvents,
  isEditEnabled,
}) => {
  return (
    <>
      <h1 style={{ textAlign: "center", color: "crimson" }}>All Events</h1>
      {/* {<pre>{JSON.stringify(students, undefined, 2)}</pre>} */}
      <TableContainer sx={{ maxHeight: "300px" }} component={Paper}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontSize: "20px" }} align="center">
                S.NO
              </TableCell>
              <TableCell style={{ fontSize: "20px" }} align="center">
                Title
              </TableCell>
              <TableCell style={{ fontSize: "20px" }} align="center">
                Start
              </TableCell>
              <TableCell style={{ fontSize: "20px" }} align="center">
                End
              </TableCell>
              <TableCell style={{ fontSize: "20px" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events?.map((Event, index) => (
              <TableRow
                key={Event.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell style={{ fontSize: "15px" }} align="center">
                  {index + 1}
                </TableCell>

                <TableCell style={{ fontSize: "15px" }} align="center">
                  {Event.title}
                </TableCell>
                <TableCell style={{ fontSize: "15px" }} align="center">
                  {Event.start.toDateString()}
                </TableCell>
                <TableCell style={{ fontSize: "15px" }} align="center">
                  {Event.end.toDateString()}
                </TableCell>
                <TableCell style={{ fontSize: "15px" }} align="center">
                  {!isEditEnabled ? (
                    <EditIcon
                      style={{
                        marginRight: "10px",
                        color: "green",
                        cursor: "pointer",
                      }}
                      onClick={() => onEditClickHandler(Event)}
                    />
                  ) : (
                    <DoneIcon
                      style={{
                        marginRight: "10px",
                        color: "green",
                        cursor: "pointer",
                      }}
                      onClick={() => onSaveChangesClickHandler()}
                    />
                  )}
                  {!isEditEnabled ? (
                    <DeleteIcon
                      style={{
                        marginRight: "10px",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => deleteEvents(Event.id)}
                    />
                  ) : (
                    <CancelIcon
                      style={{
                        marginRight: "10px",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => onCancelSaveChanges()}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AllMeetings;
