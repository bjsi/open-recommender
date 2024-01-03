import React from "react";
import { userClipsMap } from "./testData";
import { Link } from "react-router-dom";
import { ShareClipOnboardingModal } from "./ShareClipOnboardingModal";

export function Homepage() {
  return (
    <div className="p-4">
      <h1>Open Recommender Alpha</h1>
      <br></br>
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
        <li>2024-01-02: Create UI v1</li>
        <li>
          2024-01-03: Add{" "}
          <ShareClipOnboardingModal shouldOpen>
            <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
              clip sharing system
            </span>
            .
          </ShareClipOnboardingModal>
        </li>
      </ul>
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
