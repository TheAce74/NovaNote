import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useAppSelector } from "../../../redux/hooks";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import EditNote from "@mui/icons-material/EditNote";
import { ChangeEvent, useState } from "react";
import { filterUserNotes } from "../../../utils/filter";
import { useCreateDocument } from "../hooks/useCreateDocument";
import { useAlert } from "../../../hooks/useAlert";
import { useDeleteDocuments } from "../hooks/useDeleteDocuments";
import { styled } from "@mui/material/styles";
import { validateFile } from "../../../utils/functions";
import mammoth from "mammoth";
import { useImportDocument } from "../hooks/useImportDocument";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function Home() {
  const user = useAppSelector((state) => state.user);
  const [checked, setChecked] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const notes = Object.keys(user.notes).reverse();
  const { showAlert } = useAlert();
  const [textContent, setTextContent] = useState("");

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.trim());
  };

  const { createModal, openCreateModal } = useCreateDocument();
  const { deleteModal, openDeleteModal } = useDeleteDocuments(checked);
  const { importModal, openImportModal } = useImportDocument(textContent);

  const handleDelete = () => {
    if (checked.length === 0) {
      showAlert("Select at least one document", {
        variant: "error",
      });
    } else {
      openDeleteModal();
    }
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const report = validateFile(file);
      if (report[0]) {
        if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setTextContent(result.value);
            openImportModal();
          } catch (err) {
            console.error(err);
            showAlert("Error extracting text from .docx file.", {
              variant: "error",
            });
          }
        } else if (file.type === "text/plain") {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setTextContent(e.target.result as string);
              openImportModal();
            }
          };
          reader.onerror = () => {
            showAlert("Error reading .txt file.", {
              variant: "error",
            });
          };
          reader.readAsText(file);
        }
      } else {
        showAlert(report[1], {
          variant: "error",
        });
      }
    }
  };

  return (
    <Box component="section">
      <Typography
        variant="h5"
        component="h1"
        fontWeight={600}
        marginBottom={0.5}
      >
        Welcome, {user.username}
      </Typography>
      <Typography>What would you like to do today?</Typography>
      <Box>
        <Typography
          variant="h5"
          component="h2"
          fontWeight={600}
          marginTop={3}
          marginBottom={1.5}
        >
          Quick Actions
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5em",
          }}
        >
          <Button
            variant="contained"
            sx={{
              padding: 2.5,
            }}
            onClick={openCreateModal}
          >
            Create document
          </Button>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            sx={{
              padding: 2.5,
            }}
          >
            Import document
            <VisuallyHiddenInput
              type="file"
              onChange={handleImport}
              accept=".txt,.docx"
            />
          </Button>
          <Button
            variant="contained"
            sx={{
              padding: 2.5,
            }}
          >
            Export document(s)
          </Button>
          <Button
            variant="contained"
            sx={{
              padding: 2.5,
            }}
            onClick={handleDelete}
          >
            Delete document(s)
          </Button>
        </Box>
      </Box>
      <Box>
        <Typography
          variant="h5"
          component="h2"
          fontWeight={600}
          marginTop={3}
          marginBottom={1.5}
        >
          Recent Documents
        </Typography>
        <TextField
          id="search-input"
          label="Search recent document by title"
          onChange={handleSearch}
          fullWidth
        />
        <Box
          sx={{
            marginTop: "0.5em",
          }}
        >
          <List>
            {filterUserNotes(notes, user, filter).length !== 0 ? (
              filterUserNotes(notes, user, filter)
                .slice(0, 10)
                .map((note) => {
                  if (user.notes !== "") {
                    const { title } = user.notes[note];
                    const labelId = `note-${note}`;

                    return (
                      <ListItem
                        key={note}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="edit note"
                            title="Edit document"
                          >
                            <EditNote />
                          </IconButton>
                        }
                        disablePadding
                      >
                        <ListItemButton
                          role={undefined}
                          onClick={handleToggle(note)}
                          dense
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checked.indexOf(note) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={title} />
                        </ListItemButton>
                      </ListItem>
                    );
                  }
                })
            ) : (
              <Typography
                variant="h6"
                component="p"
                fontWeight={600}
                marginTop={3}
                marginBottom={1.5}
                align="center"
              >
                Nothing Found
              </Typography>
            )}
          </List>
        </Box>
      </Box>
      {createModal}
      {deleteModal}
      {importModal}
    </Box>
  );
}

export default Home;
