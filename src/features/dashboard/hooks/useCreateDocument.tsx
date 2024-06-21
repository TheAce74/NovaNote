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
import { getKeys } from "../../../utils/functions";
import { addNote } from "../../../redux/userSlice";
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

function useCreateDocument() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { id, username, notes } = useAppSelector((state) => state.user);
  const { setFireBaseUserDetails } = useFireBase();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle("");
  };

  const handleCreateDocument = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === "") {
      showAlert("Enter a title", {
        variant: "error",
      });
      return;
    }
    setLoading(true);
    const docId = getKeys(notes ? notes : {}).length;
    try {
      await setFireBaseUserDetails(
        id ?? "",
        {
          username,
          notes: {
            ...notes,
            [docId]: {
              title,
              text: "",
            },
          },
        },
        "Created successfully"
      );
      dispatch(
        addNote({
          [docId]: {
            title,
            text: "",
          },
        })
      );
      navigate(`/documents/${id}/${title}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return {
    openCreateModal: handleOpen,
    createModal: (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-modal-title"
        aria-describedby="create-modal-description"
      >
        <Box sx={style}>
          <Typography id="create-modal-title" variant="h6" component="h2">
            Create document
          </Typography>
          <Box component="form" onSubmit={handleCreateDocument}>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Enter document title"
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
                <Box component="span">Create</Box>
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

export { useCreateDocument };
