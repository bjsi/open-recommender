import { useAuth } from "../lib/useAuth";
import React from "react";

interface ProfilePageProps {}

export function ProfilePage() {
  const auth = useAuth();
  const [summaries, setSummaries] = React.useState<Summary[]>();
  const loading = !summaries;

  React.useEffect(() => {
    fetch("http://localhost:3000/api/get-summaries", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then((responseJson: GetSummariesOutput) => {
        setSummaries({
          authenticated: true,
          user: responseJson.user,
        });
      })
      .catch((error) => {
        setAuth({
          authenticated: false,
          error: "Failed to authenticate user",
        });
      });
  }, []);

  if (!auth.authenticated) {
    return <div>Not logged in</div>;
  }
  return (
    <div>
      <div>Open Recommender uses your profile to recommend things to you.</div>
      <br></br>
      <div>Currently, Open Recommender only takes Tweets as input.</div>
      <div>
        Soon, you will be able to upload any kind of data to drive
        recommendations.
      </div>
      <div>You will also be able to effortlessly </div>
    </div>
  );
}
