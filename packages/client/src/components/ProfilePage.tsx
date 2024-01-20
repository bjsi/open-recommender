import React from "react";
import { AuthInfo } from "../lib/types";
import { useParams } from "react-router-dom";
import { login } from "../lib/login";
import { RouterOutput, trpc } from "../lib/trpc";
import {
  Avatar,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

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
  const username = useParams().user!;

  const [summaries, setSummaries] =
    React.useState<RouterOutput["getSummaries"]>();
  // const loading = !summaries;
  const viewingOwnProfile =
    props.auth?.authenticated && props.auth.user.username === username;

  const [profileForUser, setProfileForUser] =
    React.useState<RouterOutput["getPublicUser"]>();

  React.useEffect(() => {
    if (!props.auth?.authenticated) return;
    trpc.getPublicUser
      .query({
        username: username,
      })
      .then((response) => {
        setProfileForUser(response);
      });
  }, []);

  React.useEffect(() => {
    if (!props.auth?.authenticated) return;
    trpc.getSummaries
      .query({
        username: username,
      })
      .then((response) => {
        setSummaries(response);
      });
  }, [props.auth, username]);

  React.useEffect(() => {
    if (!props.auth?.authenticated) return;
    trpc.getPublicUser.query({ username: username }).then((response) => {
      setProfileForUser(response);
    });
  }, [props.auth, username]);

  if (!props.auth?.authenticated) {
    return (
      <div>
        Must <a onClick={() => login()}>log in</a> to view profiles
      </div>
    );
  }

  if (!profileForUser) {
    return <div>Loading...</div>;
  }

  const rows: TableRow[] = [];
  summaries?.forEach((summary) => {
    rows.push({
      createdAt: summary.createdAt,
      type: "Summary of User",
      content: summary.data.content,
      useForRecommendations: summary.useForRecommendations,
    });
  });

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
          <a href={`https://twitter.com/${profileForUser.username}`}>
            @{profileForUser?.username}
          </a>
        </h2>
        <div>Followers: {profileForUser.followers}</div>
      </div>
      {rows.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Created At</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Use for Recommendations</TableCell>
                {viewingOwnProfile && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.content}</TableCell>
                  <TableCell>
                    <Switch checked={row.useForRecommendations} />
                  </TableCell>
                  {viewingOwnProfile && <TableCell>Edit</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>No data</div>
      )}
    </div>
  );
}
