import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { FormEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import { useAlert } from "../../../hooks/useAlert";
import CircularProgress from "@mui/material/CircularProgress";
import { theme } from "../../../mui/theme";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useFireBase } from "../../../firebase/hooks";
import { editTitle } from "../../../redux/userSlice";
import { getItem, removeItem, setItem } from "../../../utils/localStorage";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "0.3em",
};

function useEditTitle(docId: number, prevTitle: string) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(prevTitle);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { id, username, notes, profilePic } = useAppSelector(
    (state) => state.user
  );
  const { setFireBaseUserDetails } = useFireBase();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle(prevTitle);
  };

  const handleEditTitle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === "") {
      showAlert("Enter a title", {
        variant: "error",
      });
      return;
    }
    if (prevTitle.trim() === title.trim()) {
      showAlert("Title unchanged", {
        variant: "info",
      });
      return;
    }
    setLoading(true);
    try {
      await setFireBaseUserDetails(
        id ?? "",
        {
          username,
          notes: {
            ...notes,
            [docId]: {
              title,
              text: notes ? notes[docId].text : "",
            },
          },
          profilePic,
        },
        "Edited successfully"
      );
      dispatch(
        editTitle({
          id: docId,
          title,
        })
      );
      setItem(`NovaNote (${title})`, getItem(`NovaNote (${prevTitle})`));
      removeItem(`NovaNote (${prevTitle})`);
      navigate(`/documents/${id}/${title}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return {
    openEditTitleModal: handleOpen,
    editTitleModal: (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-modal-title"
        aria-describedby="create-modal-description"
      >
        <Box sx={style}>
          <Typography id="create-modal-title" variant="h6" component="h2">
            Edit document title
          </Typography>
          <Box component="form" onSubmit={handleEditTitle}>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Enter new title"
              fullWidth={true}
              sx={{
                marginBottom: "1.5em",
                marginTop: "1em",
              }}
            />
            <Button
              variant="contained"
              type="submit"
              sx={{
                padding: "0.8em 1.8em",
                display: "block",
                marginLeft: "auto",
              }}
              disabled={loading}
            >
              {!loading ? (
                <Box component="span">Edit</Box>
              ) : (
                <Box
                  sx={{ display: "flex" }}
                  color={theme.palette.background.default}
                >
                  <CircularProgress color="inherit" size={25} />
                </Box>
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    ),
  };
}

export { useEditTitle };
