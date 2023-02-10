import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Card,
  Box,
  Pagination,
  Grid,
  Container,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getFriendRequests, getFriendRequestsSent } from "./friendSlice";
import UserCard from "./UserCard";
import SearchInput from "../../components/SearchInput";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function FriendRequests() {
  const [filterName, setFilterName] = useState("");
  const [page, setPage] = React.useState(1);
  const [requestsType, setRequestsType] = useState("incoming");

  const handleChange = (event) => {
    setRequestsType(event.target.value);
  };

  const { currentPageUsers, usersById, totalUsers, totalPages } = useSelector(
    (state) => state.friend
  );
  const users = currentPageUsers.map((userId) => usersById[userId]);
  const dispatch = useDispatch();

  const handleSubmit = (searchQuery) => {
    setFilterName(searchQuery);
  };

  useEffect(() => {
    if (requestsType === "incoming") {
      dispatch(getFriendRequests({ filterName, page }));
    }
    if (requestsType === "outgoing") {
      dispatch(getFriendRequestsSent({ filterName, page }));
    }
  }, [filterName, page, dispatch, requestsType]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Friend Requests
      </Typography>
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems="center">
            <SearchInput handleSubmit={handleSubmit} />
            <Box sx={{ flexGrow: 1 }} />
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Friend Requests Type
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={requestsType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="incoming"
                  control={<Radio />}
                  label="Received"
                />
                <FormControlLabel
                  value="outgoing"
                  control={<Radio />}
                  label="Sent"
                />
              </RadioGroup>
            </FormControl>
            <Box sx={{ flexGrow: 1 }} />
            <Typography
              variant="subtitle"
              sx={{ color: "text.secondary", ml: 1 }}
            >
              {totalUsers > 1
                ? `${totalUsers} requests found`
                : totalUsers === 1
                ? `${totalUsers} request found`
                : "No request found"}
            </Typography>

            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, page) => setPage(page)}
            />
          </Stack>
        </Stack>

        <Grid container spacing={3} my={1}>
          {users.map((user) => (
            <Grid key={user._id} item xs={12} md={4}>
              <UserCard profile={user} />
            </Grid>
          ))}
        </Grid>
      </Card>
    </Container>
  );
}

export default FriendRequests;
