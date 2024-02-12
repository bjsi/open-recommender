import { useEffect, useState } from "react";
import { AdminRouterOutput, trpcAdmin } from "../lib/trpc";
import ReactJson from "react-json-view";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
dayjs.extend(relativeTime);

export const AdminPage = () => {
  const [pipelines, setPipelines] = useState<
    AdminRouterOutput["getPipelinesAndTasks"]
  >([]);
  useEffect(() => {
    // Function to fetch data
    const fetchData = () => {
      trpcAdmin.getPipelinesAndTasks.query().then((data) => {
        setPipelines(data);
      });
    };

    // Fetch data immediately and then set up the interval
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10000 ms = 10 seconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleCancel = (pipelineId: number) => {};

  const handleRetry = (pipelineId: number) => {};

  const handleDelete = (pipelineId: number) => {};

  if (pipelines.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <TableContainer component={Paper}>
      <Table aria-label="pipelines table">
        <TableHead>
          <TableRow>
            <TableCell>
              <span className="font-semibold">Username</span>
            </TableCell>
            <TableCell>
              <span className="font-semibold">Created</span>
            </TableCell>
            <TableCell>
              <span className="font-semibold">Tasks</span>
            </TableCell>
            <TableCell>
              <span className="font-semibold">Actions</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pipelines.map((pipeline) => (
            <React.Fragment key={pipeline.id}>
              <TableRow>
                <TableCell component="th" scope="row">
                  {pipeline.username}
                </TableCell>
                <TableCell>{dayjs(pipeline.createdAt).fromNow()}</TableCell>
                <TableCell>
                  {pipeline.tasks.map((task) => (
                    <div key={task.id}>
                      <ReactJson
                        src={task}
                        displayDataTypes={false}
                        name={null}
                      />
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {pipeline.status === "running" ? (
                    <Button
                      onClick={() => handleCancel(pipeline.id)}
                      color="secondary"
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button onClick={() => handleRetry(task.id)} color="primary">
                    Retry
                  </Button>
                  <Button onClick={() => handleDelete(task.id)} color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
