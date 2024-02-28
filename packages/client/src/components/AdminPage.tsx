import { useEffect, useState } from "react";
import { AdminRouterOutput, trpcAdmin } from "../lib/trpc";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Button,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { sortBy } from "remeda";

dayjs.extend(relativeTime);

export const AdminPage = () => {
  const [pipelines, setPipelines] =
    useState<AdminRouterOutput["getPipelinesAndTasks"]>();
  const [force, setForce] = useState(0);
  useEffect(() => {
    // Function to fetch data
    const fetchData = () => {
      trpcAdmin.getPipelinesAndTasks.query().then((data) => {
        setPipelines(data);
      });
    };

    // Fetch data immediately and then set up the interval
    fetchData();
    const interval = setInterval(fetchData, 5000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [force]);

  if (!pipelines) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Button onClick={() => trpcAdmin.unlockWorkers.mutate()}>
        Force unlock workers
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="pipelines table">
          <TableHead>
            <TableRow>
              <TableCell>
                <span className="font-semibold">Username</span>
              </TableCell>
              <TableCell>
                <span className="font-semibold">Created At</span>
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
            {sortBy(pipelines, (x) => dayjs(x.createdAt).valueOf()).map(
              (pipeline) => (
                <PipelineRow
                  key={pipeline.id}
                  pipeline={pipeline}
                  setForce={setForce}
                />
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

interface TasksTableProps {
  tasks: AdminRouterOutput["getPipelinesAndTasks"][0]["tasks"];
  pipeline: AdminRouterOutput["getPipelinesAndTasks"][0];
  setForce: React.Dispatch<React.SetStateAction<number>>;
  expanded: boolean;
}

function TasksTable(props: TasksTableProps) {
  const { tasks } = props;
  const handleRetryTask = async (taskId: string) => {
    await trpcAdmin.retryPipelineTask.mutate({ id: taskId });
    props.setForce((prev) => prev + 1);
  };

  return (
    <Collapse collapsedSize={100} in={props.expanded}>
      <TableContainer component={Paper}>
        <Table aria-label="tasks table">
          <TableHead>
            <TableRow>
              <TableCell>
                <span className="font-semibold">Stage</span>
              </TableCell>
              <TableCell>
                <span className="font-semibold">Created</span>
              </TableCell>
              <TableCell>
                <span className="font-semibold">Status</span>
              </TableCell>
              <TableCell>
                <span className="font-semibold">Logs</span>
              </TableCell>
              <TableCell>
                <span className="font-semibold">Actions</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortBy(tasks, (x) => dayjs(x.createdAt).valueOf()).map(
              (task, idx) => (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>
                    {
                      // mins since pipeline created
                      "+" +
                        dayjs(task.createdAt).diff(
                          dayjs(props.pipeline.createdAt),
                          "minute"
                        ) +
                        " mins"
                    }
                  </TableCell>
                  <TableCell>
                    {idx === 0 ? props.pipeline.status : task.status}
                  </TableCell>
                  <TableCell>
                    {task.logs.length > 0 && (
                      <ul>
                        {task.logs
                          .filter((x) => x.level !== "debug")
                          .map((log, idx) => (
                            <li key={idx}>{log.log}</li>
                          ))}
                      </ul>
                    )}
                  </TableCell>
                  <TableCell>
                    {
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetryTask(task.jobId);
                        }}
                        color="primary"
                      >
                        Retry Now
                      </Button>
                    }
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Collapse>
  );
}

interface PipelineRowProps {
  pipeline: AdminRouterOutput["getPipelinesAndTasks"][0];
  setForce: React.Dispatch<React.SetStateAction<number>>;
}

function PipelineRow(props: PipelineRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { pipeline, setForce } = props;
  const handleDeletePipeline = async (pipelineId: number) => {
    await trpcAdmin.deletePipeline.mutate({ id: pipelineId });
    setForce((prev) => prev + 1);
  };
  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => {
        setExpanded((prev) => !prev);
      }}
      key={pipeline.id}
    >
      <TableCell component="th" scope="row">
        {pipeline.username}
      </TableCell>
      <TableCell>
        {dayjs(pipeline.createdAt).format("YY-MM-DD HH:mm:ss")}
      </TableCell>
      {
        //<TableCell>{pipeline.status}</TableCell>
      }
      <TableCell>
        {pipeline.tasks.length === 0 ? (
          "No tasks"
        ) : (
          <TasksTable
            expanded={expanded}
            pipeline={pipeline}
            setForce={setForce}
            tasks={pipeline.tasks}
          />
        )}
      </TableCell>
      <TableCell>
        <Button onClick={() => handleDeletePipeline(pipeline.id)} color="error">
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}
