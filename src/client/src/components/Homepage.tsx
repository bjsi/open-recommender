import React from "react";
import { userClipsMap } from "../data/testData";
import { Link } from "react-router-dom";

export function Homepage() {
  return (
    <div className="p-4">
      <h1>Open Recommender Alpha</h1>
      <br></br>
      <p>
        I want to explore the potential for a system that borrows the best
        elements from YouTube shorts, TikTok, spaced repetition and incremental
        reading to create something that feels as effortless and engaging as a
        queue of YouTube shorts but actually helps you make progress towards
        meaningful goals.
      </p>
      <br></br>
      <p>Users:</p>
      <ul className="list-disc list-inside">
        {Object.entries(userClipsMap).map(([user, clips]) => (
          <li key={user}>
            <Link to={`/user/${user}`}>
              {user} - {clips.length} clips
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
