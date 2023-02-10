import React, { useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import useAuth from "../../hooks/useAuth";
import ConfirmationMsg from "../../components/ConfirmationMsg";
import { useDispatch } from "react-redux";
import { deletePost } from "./postSlice";
import PostEditForm from "./PostEditForm";
import { set } from "lodash";
function PostCard({ post }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const auth = useAuth();
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const handleClick = (event) => {
    if (post.author._id === auth.user._id) {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleDelete = () => {
    setAnchorEl(null);
    setOpenConfirmation(true);
  };
  const handleClose = (type, isDeleted = false) => {
    if (type === "Menu") setAnchorEl(null);
    if (type === "ConfirmationMsg") {
      setOpenConfirmation(false);
      if (isDeleted) {
        dispatch(deletePost(auth.user._id, post._id));
      }
    }
  };

  const handleEdit = () => {
    setAnchorEl(null);
    setIsEditting(true);
  };
  if (!isEditting) {
    return (
      <>
        <Card>
          <CardHeader
            disableTypography
            avatar={
              <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
            }
            title={
              <Link
                variant="subtitle2"
                color="text.primary"
                component={RouterLink}
                sx={{ fontWeight: 600 }}
                to={`/user/${post.author._id}`}
              >
                {post?.author?.name}
              </Link>
            }
            subheader={
              <Typography
                variant="caption"
                sx={{ display: "block", color: "text.secondary" }}
              >
                {fDate(post.createdAt)}
              </Typography>
            }
            action={
              <>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => {
                    handleClose("Menu");
                  }}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem divider onClick={handleDelete}>
                    Delete
                  </MenuItem>
                  <MenuItem onClick={handleEdit}>Edit</MenuItem>
                </Menu>
              </>
            }
          />

          <Stack spacing={2} sx={{ p: 3 }}>
            <Typography>{post.content}</Typography>

            {post.image && (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 300,
                  "& img": { objectFit: "cover", width: 1, height: 1 },
                }}
              >
                <img src={post.image} alt="post" />
              </Box>
            )}

            <PostReaction post={post} />
            <CommentList postId={post._id} />
            <CommentForm postId={post._id} />
          </Stack>
        </Card>
        <ConfirmationMsg
          type={"post"}
          open={openConfirmation}
          handleClose={handleClose}
        />
      </>
    );
  } else if (isEditting) {
    return (
      <PostEditForm
        postId={post._id}
        userId={post.author._id}
        defaultContent={post.content}
        defaultImg={post.image}
      />
    );
  }
}

export default PostCard;
