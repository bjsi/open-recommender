import React from "react";
import { AuthInfo } from "../lib/types";
import { useParams } from "react-router-dom";
import { login } from "../lib/login";
import { RouterOutput, trpc } from "../lib/trpc";
import {
  Avatar,
  Button,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import * as _ from "remeda";
import dayjs from "dayjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
      type: "Twitter Summary",
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
        ) : null}
      </div>
      <br></br>

      <div className="flex items-center gap-2">
        <TextField
          id="outlined-basic"
          label="Custom Query"
          variant="outlined"
        />
        <Button variant="contained">Search</Button>
      </div>
      <br></br>
      <h3>Recommendation Inputs</h3>
      <br></br>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Content</TableCell>
              {viewingOwnProfile && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {_.sortBy(rows, (x) => x.createdAt).map((row, idx) => (
              <SummaryRow
                key={idx}
                row={row}
                viewingOwnProfile={!!viewingOwnProfile}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

interface SummaryRowProps {
  row: TableRow;
  viewingOwnProfile: boolean;
}

function SummaryRow(props: SummaryRowProps) {
  const { row, viewingOwnProfile } = props;
  const [expanded, setExpanded] = React.useState(false);
  return (
    <TableRow>
      <TableCell>{dayjs(row.createdAt).format("YY-MM-DD")}</TableCell>
      <TableCell>{row.type}</TableCell>
      <TableCell>
        <Collapse
          className="relative max-w-[600px]"
          collapsedSize={200}
          in={expanded}
        >
          <Typography>{row.content}</Typography>
          <div
            className="absolute right-0 -bottom-2"
            onClick={() => {
              setExpanded(!expanded);
            }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
        </Collapse>
      </TableCell>
      {viewingOwnProfile && (
        <TableCell>
          <div>{/* <Button>Edit</Button> */}</div>
          <div>
            <Button onClick={() => {}} variant="contained">
              Get Recommendations
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}
