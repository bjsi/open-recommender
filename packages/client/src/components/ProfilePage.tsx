import React from "react";
import { Summary } from "shared/types/summary";
import { GetSummariesOutput } from "shared/schemas/getSummaries";
import { AuthInfo } from "../lib/types";
import { useParams } from "react-router-dom";
import { login } from "../lib/login";

interface ProfilePageProps {
  auth: AuthInfo | undefined;
}

export function ProfilePage(props: ProfilePageProps) {
  const username = useParams().user;
  const [summaries, setSummaries] = React.useState<Summary[]>();
  const loading = !summaries;

  React.useEffect(() => {
    if (!props.auth?.authenticated) return;
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-summaries`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then((responseJson: GetSummariesOutput) => {
        setSummaries(responseJson.summaries);
      });
  }, [props.auth, username]);

  //   React.useEffect(() => {
  //     if (!auth?.authenticated) return;
  //     fetch("import.meta.env.VITE_SERVER_URL/api/get-likes", {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Credentials": "true",
  //       },
  //     })
  //       .then((response) => {
  //         if (response.status === 200) return response.json();
  //         throw new Error("failed to authenticate user");
  //       })
  //       .then((responseJson: GetSummariesOutput) => {
  //         setSummaries(responseJson.summaries);
  //       });
  //   }, [auth]);

  if (!props.auth?.authenticated) {
    return (
      <div>
        Must <a onClick={() => login()}>log in</a> to view profiles
      </div>
    );
  }
  return (
    <div className="p-4">
      <div>Currently, Open Recommender takes Tweets as input.</div>
      <br></br>
      <div>
        Soon, you will be able to upload any kind of data, either here or via
        the API, to drive recommendations.
      </div>
      <br></br>
      <div>Data</div>
      <ul>
        {summaries?.map((summary, idx) => (
          <li key={idx}>
            <div>{summary.data.summary}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
