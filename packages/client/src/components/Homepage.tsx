import React from "react";
import { Link } from "react-router-dom";
import { ShareClipOnboardingModal } from "./ShareClipOnboardingModal";
import { User } from "shared/types/user";
import { GetUsersOutput } from "shared/schemas/getUsers";
import { useAuth } from "../lib/useAuth";

export function Homepage() {
  const auth = useAuth();
  const [users, setUsers] = React.useState<User[]>();

  React.useEffect(() => {
    fetch("http://localhost:3000/api/top-users", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed to get users");
      })
      .then((responseJson: GetUsersOutput) => {
        console.log(responseJson);
        setUsers(responseJson.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="p-4">
      {auth?.authenticated ? (
        <>
          <div>Welcome back, {auth.user.name}</div>
          <br></br>
        </>
      ) : (
        "Not logged in"
      )}
      <p>
        I want to build a system that borrows the best elements from YouTube
        shorts, TikTok, <a href="">spaced repetition</a> and{" "}
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
        <a href="https://buy.stripe.com/bIY7tbco90f23sY9AC">Subscribe here</a>{" "}
        and I'll add you to the beta. Got ideas?{" "}
        <a href="https://twitter.com/experilearning">DM me on Twitter</a>. Or
        even better:{" "}
        <ShareClipOnboardingModal shouldOpen>
          <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
            share a Tweet into my recommendation queue.
          </span>
        </ShareClipOnboardingModal>
      </p>
      <br></br>
      <p></p>
      <p>Changelog</p>
      <ul className="list-disc list-inside">
        <li>2024-01-14: Add API.</li>
        <li>2024-01-13: Add auth and server.</li>
        <li>
          2024-01-08: Integrate <a href="https://metaphor.systems/">metaphor</a>
          .
        </li>
        <li>2024-01-04: Fix clip seeking bug.</li>
        <li>
          2024-01-03: Add{" "}
          <ShareClipOnboardingModal shouldOpen>
            <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
              clip sharing system
            </span>
            .
          </ShareClipOnboardingModal>
        </li>
        <li>2024-01-02: Create UI v1</li>
      </ul>
      <br></br>
      <p>Top Users:</p>
      <ul className="list-disc list-inside">
        {(users || []).map((user) => (
          <li key={user?.id}>
            <Link to={`/user/${user.username}`}>
              {user.name} (@{user.username}) - {user.recommendations.length}{" "}
              clips
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
