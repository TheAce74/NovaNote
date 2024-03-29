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
import { useState } from "react";
import { filterUserNotes } from "../../../utils/filter";

function Documents() {
  const user = useAppSelector((state) => state.user);
  const [checked, setChecked] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const notes = Object.keys(user.notes).reverse();

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

  return (
    <Box component="section">
      <Typography
        variant="h5"
        component="h1"
        fontWeight={600}
        marginBottom={2.5}
      >
        All Documents
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5em",
        }}
        marginBottom={3}
      >
        <Button
          variant="contained"
          sx={{
            padding: 2.5,
          }}
        >
          Create document
        </Button>
        <Button
          variant="contained"
          sx={{
            padding: 2.5,
          }}
        >
          Import document
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
        >
          Delete document(s)
        </Button>
      </Box>
      <Box>
        <TextField
          id="search-input"
          label="Search for document by title"
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
              filterUserNotes(notes, user, filter).map((note) => {
                if (user.notes !== "") {
                  const { title } = user.notes[note];
                  const labelId = `note-${note}`;

                  return (
                    <ListItem
                      key={note}
                      secondaryAction={
                        <IconButton edge="end" aria-label="edit note">
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
    </Box>
  );
}

export default Documents;
