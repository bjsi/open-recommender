import React from "react";
import { AuthInfo } from "../lib/types";
import { useParams } from "react-router-dom";
import { login } from "../lib/login";
import { RouterOutput, trpc } from "../lib/trpc";
import {
  Avatar,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import * as _ from "remeda";
import { OnboardingModal } from "./OnboardingModal";

interface ProfilePageProps {
  auth: AuthInfo | undefined;
}

interface TableRow {
  createdAt: string;
  type: string;
  content: string;
  useForRecommendations: boolean;
}

export function ProfilePage(props: ProfilePageProps) {
  const usernameForProfile = useParams().user!;

  const [summaries, setSummaries] =
    React.useState<RouterOutput["getSummaries"]>();
  // const loading = !summaries;
  const viewingOwnProfile =
    props.auth?.authenticated &&
    props.auth.user.username === usernameForProfile;

  const [profileForUser, setProfileForUser] =
    React.useState<RouterOutput["getPublicUser"]>();

  const [isFollowing, setIsFollowing] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!props.auth?.authenticated) return;
    if (viewingOwnProfile) return;
    trpc.isFollowing
      .query({ username: usernameForProfile })
      .then((response) => {
        setIsFollowing(!!response);
      });
  }, [props.auth, usernameForProfile]);

  React.useEffect(() => {
    if (!props.auth?.authenticated) return;
    trpc.getPublicUser
      .query({
        username: usernameForProfile,
      })
      .then((response) => {
        setProfileForUser(response);
      });
  }, []);

  React.useEffect(() => {
    if (!props.auth?.authenticated) return;
    trpc.getSummaries
      .query({
        username: usernameForProfile,
      })
      .then((response) => {
        setSummaries(response);
      });
  }, [props.auth, usernameForProfile]);

  React.useEffect(() => {
    if (!props.auth?.authenticated) return;
    trpc.getPublicUser
      .query({ username: usernameForProfile })
      .then((response) => {
        setProfileForUser(response);
      });
  }, [props.auth, usernameForProfile]);
  const [apiKey, setApiKey] = React.useState<{
    loading: boolean;
    data?: string;
  }>();
  if (!props.auth?.authenticated) {
    return (
      <div>
        Must <a onClick={() => login()}>log in</a> to view profiles
      </div>
    );
  }

  const rows: TableRow[] = [];
  summaries?.forEach((summary) => {
    rows.push({
      createdAt: summary.createdAt,
      type: "Summary of User",
      content: summary.content,
      useForRecommendations: summary.useForRecommendations,
    });
  });

  if (!profileForUser) {
    return <div>Loading...</div>;
  }

  profileForUser.following.forEach((follow) => {
    rows.push({
      createdAt: follow.createdAt,
      type: "Following",
      content: follow.user.username,
      useForRecommendations: true,
    });
  });

  return (
    <div className="p-4">
      <div>
        <Avatar src={profileForUser?.profile_image_url}></Avatar>
        <h2>
          {profileForUser?.name}{" "}
          <a href={`https://twitter.com/${profileForUser.username}`}>
            (@{profileForUser?.username})
          </a>
        </h2>
        <div>Followers: {profileForUser.followers}</div>
        <br></br>
        {!viewingOwnProfile ? (
          <Tooltip title="Follow users to get recommended clips they liked.">
            <Button
              variant="contained"
              onClick={() => {
                setIsFollowing(!isFollowing);
                trpc.toggleFollowing
                  .mutate({ username: usernameForProfile })
                  .then((response) => {
                    setIsFollowing(!!response);
                  });
              }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </Tooltip>
        ) : (
          <>
            {!apiKey ? (
              <Button
                disabled={!!apiKey}
                variant="outlined"
                onClick={async () => {
                  setApiKey({ loading: true });
                  const key = await trpc.getAPIKey.mutate();
                  if (!key) {
                    console.log("error getting api key");
                    return;
                  }
                  setApiKey({ loading: false, data: key });
                }}
              >
                Get API Key
              </Button>
            ) : (
              <div>
                Your API Key (
                <OnboardingModal
                  shouldOpen
                  okayText="Ok"
                  title="API Key"
                  content="This is your API key. You can use it to upload custom recommendation inputs and get recommendations programmatically. It's like a password, so don't share it with anyone. It will only be shown once. If you lose your key or accidentally share it, create a new API key. You can paste this into the RemNote Incremental Everything plugin to interleave your recommendations with existing elements."
                >
                  <a>What is this?</a>
                </OnboardingModal>
                ): <pre>{apiKey.data}</pre>
              </div>
            )}
          </>
        )}
      </div>
      <br></br>
      <div>This table summarizes recommendation inputs.</div>
      <br></br>
      {
        <OnboardingModal
          shouldOpen
          okayText="Ok"
          title="TODO: DM James :)"
          content="Didn't get around to implementing yet, please DM me and I can upload for you! Supports any text. Ideally summarized into max 2k tokens. Will eventually have full API support for create/update/delete recommendation inputs."
        >
          <Button variant="outlined">Upload Custom Input</Button>
        </OnboardingModal>
      }
      <br></br>
      <br></br>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Content</TableCell>
              {viewingOwnProfile && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {_.sortBy(rows, (x) => x.createdAt).map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.createdAt}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.content}</TableCell>
                {viewingOwnProfile && <TableCell>Edit</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
