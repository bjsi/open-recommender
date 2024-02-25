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
  Snackbar,
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

interface SummaryRowData {
  id: number;
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
  const [requestingRecommendations, setRequestingRecommendations] =
    React.useState(false);

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

  const rows: SummaryRowData[] = [];
  summaries?.forEach((summary) => {
    rows.push({
      id: summary.id,
      createdAt: summary.createdAt,
      type: "Twitter Summary",
      content: summary.content,
      useForRecommendations: summary.useForRecommendations,
    });
  });

  const [customQuery, setCustomQuery] = React.useState<string>("");
  const [customQueryMessage, setCustomQueryMessage] =
    React.useState<string>("");
  const handleClose = () => {
    setCustomQueryMessage("");
  };

  if (!profileForUser) {
    return <div>Loading...</div>;
  }

  // profileForUser.following.forEach((follow) => {
  //   rows.push({
  //     id: follow.id,
  //     createdAt: follow.createdAt,
  //     type: "Following",
  //     content: follow.user.username,
  //     useForRecommendations: true,
  //   });
  // });

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

      {viewingOwnProfile && (
        <div className="flex items-center gap-2">
          <TextField
            disabled={requestingRecommendations}
            id="outlined-basic"
            label="Custom Query"
            variant="outlined"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
          />
          <Button
            disabled={!customQuery || requestingRecommendations}
            onClick={async () => {
              setRequestingRecommendations(true);
              const res = await trpc.requestRecommendations.mutate({
                customQuery,
              });
              console.log(res);
              if (res.type === "success") {
                setCustomQueryMessage("Recommendations pipeline started");
              } else {
                setCustomQueryMessage(res.error);
              }
              setRequestingRecommendations(false);
            }}
            variant="contained"
          >
            Search
          </Button>
          <Snackbar
            open={!!customQueryMessage}
            autoHideDuration={6000}
            onClose={handleClose}
            message={customQueryMessage}
          />
        </div>
      )}
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
                requestingRecommendations={requestingRecommendations}
                setRequestingRecommendations={setRequestingRecommendations}
                key={idx}
                row={row}
                viewingOwnProfile={!!viewingOwnProfile}
                auth={props.auth}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

interface SummaryRowProps {
  row: SummaryRowData;
  viewingOwnProfile: boolean;
  auth: AuthInfo | undefined;
  requestingRecommendations: boolean;
  setRequestingRecommendations: (value: boolean) => void;
}

function SummaryRow(props: SummaryRowProps) {
  const { row, viewingOwnProfile, auth } = props;
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
      {viewingOwnProfile && auth?.authenticated && (
        <TableCell>
          <div>{/* <Button>Edit</Button> */}</div>
          <div>
            <GetRecommendationsButton
              setRequestingRecommendations={props.setRequestingRecommendations}
              row={row}
              auth={auth}
            />
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

interface GetRecommendationsButtonProps {
  row: SummaryRowData;
  auth: AuthInfo | undefined;
  disabled?: boolean;
  setRequestingRecommendations: (value: boolean) => void;
}

function GetRecommendationsButton(props: GetRecommendationsButtonProps) {
  const [message, setMessage] = React.useState("");
  const handleClose = () => {
    setMessage("");
  };
  return (
    <>
      <Button
        disabled={props.disabled}
        onClick={async () => {
          props.setRequestingRecommendations(true);
          const res = await trpc.requestRecommendations.mutate({
            summaryId: props.row.id,
          });
          if (res.type === "success") {
            setMessage("Recommendations pipeline started");
          } else {
            setMessage(res.error);
          }
          props.setRequestingRecommendations(false);
        }}
        variant="contained"
      >
        Get Recommendations
      </Button>
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
      />
    </>
  );
}
