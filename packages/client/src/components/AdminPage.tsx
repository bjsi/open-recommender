import { useEffect, useState } from "react";
import { RouterOutput, trpc } from "../lib/trpc";
import ReactJson from "react-json-view";

export const AdminPage = () => {
  const [pipelines, setPipelines] = useState<
    RouterOutput["getPipelinesAndTasks"]
  >([]);
  useEffect(() => {
    // Function to fetch data
    const fetchData = () => {
      trpc.getPipelinesAndTasks.query().then((data) => {
        setPipelines(data);
      });
    };

    // Fetch data immediately and then set up the interval
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10000 ms = 10 seconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (pipelines.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h2>Pipelines</h2>
      {pipelines.map((pipeline) => (
        <div key={pipeline.id}>
          <h2>
            {pipeline.username} - {pipeline.createdAt}
          </h2>
          {pipeline.tasks.map((task) => (
            <div key={task.id}>
              <ReactJson
                src={{
                  ...task,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
