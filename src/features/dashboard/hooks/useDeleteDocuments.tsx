import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { theme } from "../../../mui/theme";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useFireBase } from "../../../firebase/hooks";
import { getKeys, removeKey } from "../../../utils/functions";
import { setNotes } from "../../../redux/userSlice";
import { INotes } from "../../../utils/types";

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

function useDeleteDocuments(checked: string[]) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id, username, notes, profilePic } = useAppSelector(
    (state) => state.user
  );
  const { setFireBaseUserDetails } = useFireBase();
  const dispatch = useAppDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteDocument = async () => {
    setLoading(true);
    let notesCopy = { ...notes };
    for (let i = 0; i < checked.length; i++) {
      notesCopy = removeKey(notesCopy, checked[i]) as INotes;
    }
    const keys = getKeys(notesCopy);
    const newNotes = keys.reduce(
      (acc, key, idx) =>
        Object.assign(acc, {
          [idx]: {
            title: notesCopy[key].title,
            text: notesCopy[key].text,
          },
        }),
      {}
    ) as INotes;

    try {
      await setFireBaseUserDetails(
        id ?? "",
        {
          username,
          notes: newNotes,
          profilePic,
        },
        "Deleted successfully"
      );
      dispatch(setNotes(newNotes));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return {
    openDeleteModal: handleOpen,
    deleteModal: (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={style}>
          <Typography id="delete-modal-title" variant="h6" component="h2">
            Delete document(s)
          </Typography>
          <p
            style={{
              marginTop: "0.5em",
              marginBottom: "0.8em",
            }}
          >
            Are you sure you want to delete the following document(s)?
          </p>
          <ul
            style={{
              listStyle: "none",
            }}
          >
            {checked.map((item) => (
              <li
                key={item}
                style={{
                  marginBottom: "0.8em",
                  fontStyle: "italic",
                }}
              >
                {notes ? notes[item]?.title : ""}
              </li>
            ))}
          </ul>
          <Button
            variant="contained"
            type="submit"
            sx={{
              padding: "0.8em 1.8em",
              display: "block",
              marginLeft: "auto",
            }}
            disabled={loading}
            onClick={handleDeleteDocument}
          >
            {!loading ? (
              <Box component="span">Delete</Box>
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
      </Modal>
    ),
  };
}

export { useDeleteDocuments };
