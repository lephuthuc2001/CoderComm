import React, { useState } from "react";
import {
  Avatar,
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationMsg from "../../components/ConfirmationMsg";
import { deleteComment } from "./commentSlice";
import { useDispatch } from "react-redux";

function CommentCard({ comment }) {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const dispatch = useDispatch();
  const handleClose = (type, isDeleted = false) => {
    if (type === "ConfirmationMsg") {
      setOpenConfirmation(false);
      if (isDeleted) {
        dispatch(deleteComment(comment.post, comment._id));
      }
    }
  };
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
        <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
          <Stack
            direction="row"
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.author?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              {fDate(comment.createdAt)}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {comment.content}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => {
                setOpenConfirmation(true);
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            <CommentReaction comment={comment} />
          </Box>
        </Paper>
      </Stack>
      <ConfirmationMsg
        type={"comment"}
        open={openConfirmation}
        handleClose={handleClose}
      />
    </>
  );
}

export default CommentCard;
