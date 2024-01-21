import React from "react";
import { Link } from "react-router-dom";
import { AuthInfo } from "../lib/types";
import { RouterOutput, trpc } from "../lib/trpc";

interface HomepageProps {
  auth: AuthInfo | undefined;
}

export function Homepage(props: HomepageProps) {
  const [users, setUsers] = React.useState<RouterOutput["topUsers"]>();

  React.useEffect(() => {
    trpc.topUsers.query().then((response) => {
      setUsers(response);
    });
  }, []);

  return (
    <div className="p-4">
      {props.auth?.authenticated ? (
        <>
          <div>Welcome back to Open Recommender, {props.auth.user.name}</div>
          <br></br>
        </>
      ) : null}
      <p>
        I want to build a system that borrows the best elements from YouTube
        shorts, TikTok,{" "}
        <a href="https://www.youtube.com/watch?v=fkU0p1pUVSs">
          spaced repetition
        </a>{" "}
        and{" "}
        <a href="https://www.youtube.com/watch?v=oNCLLNZEtz0">
          incremental reading
        </a>{" "}
        to create something that feels as effortless and engaging as a queue of
        YouTube shorts but actually helps you improve your life and make
        progress towards meaningful goals.{" "}
        <a href="https://dev.to/experilearning/from-spaced-repetition-systems-to-open-recommender-systems-25ab">
          Read this article
        </a>
        .
      </p>
      <br></br>
      <p>
        Interested?{" "}
        <a href="https://buy.stripe.com/8wMfZb9Ng6Oq6fC7ss">Subscribe here</a>{" "}
        and I'll add you to the beta. Got ideas?{" "}
        <a href="https://twitter.com/experilearning">DM me on Twitter</a>.
      </p>
      <br></br>
      <p></p>
      <p>Changelog</p>
      <ul className="list-disc list-inside">
        <li>2024-01-21: Implement user profile and follower system.</li>
        <li>2024-01-14: Add API.</li>
        <li>2024-01-13: Add auth and server.</li>
        <li>
          2024-01-08: Integrate <a href="https://metaphor.systems/">metaphor</a>
          .
        </li>
      </ul>
      <br></br>
      <p>Top Users:</p>
      <ul className="list-disc list-inside">
        {(users || []).map((user) => (
          <li key={user.username}>
            <Link to={`/user/${user.username}/profile`}>{user.name}</Link> -{" "}
            <Link to={`/user/${user.username}/feed`}>
              {user.recommendations} clips
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
