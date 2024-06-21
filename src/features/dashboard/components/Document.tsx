import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useState } from "react";
import { getKeys } from "../../../utils/functions";
import { useAlert } from "../../../hooks/useAlert";
import styles from "./Document.module.css";
import { MdEdit } from "react-icons/md";
import { getItem, removeItem, setItem } from "../../../utils/localStorage";
import { useEditTitle } from "../hooks/useEditTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { theme } from "../../../mui/theme";
import { useFireBase } from "../../../firebase/hooks";
import { editNote } from "../../../redux/userSlice";

export default function Document() {
  const { notes, id, username } = useAppSelector((state) => state.user);
  const { user: ownerId, title } = useParams();
  const [note, setNote] = useState("");
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [readOnly, setReadOnly] = useState(true);
  const [noteId, setNoteId] = useState(Infinity);
  const [loading, setLoading] = useState(false);

  const quillTheme = "snow";
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      ["link", "image", "video"],

      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],

      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }],
      [{ align: [] }],

      ["clean"],
    ],
  };
  const placeholder = "Start your masterpiece here...";
  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
    "header",
    "list",
    "script",
    "indent",
    "size",
    "color",
    "background",
    "align",
    "clean",
  ];
  const { quill, quillRef } = useQuill({
    theme: quillTheme,
    modules,
    formats,
    placeholder,
    readOnly,
  });

  const { openEditTitleModal, editTitleModal } = useEditTitle(
    noteId,
    title ?? ""
  );

  const handleCloseDocument = () => {
    removeItem(`NovaNote (${title})`);
    navigate("/documents");
  };

  const { setFireBaseUserDetails, getFireBaseDetails } = useFireBase();
  const dispatch = useAppDispatch();

  const handleSaveDocument = async () => {
    setLoading(true);
    try {
      await setFireBaseUserDetails(
        id ?? "",
        {
          username,
          notes: {
            ...notes,
            [noteId]: {
              title,
              text: getItem(`NovaNote (${title})`),
            },
          },
        },
        "Saved successfully"
      );
      dispatch(
        editNote({
          id: noteId,
          text: getItem(`NovaNote (${title})`) as string,
        })
      );
    } catch (e) {
      console.error(e);
    } finally {
      removeItem(`NovaNote (${title})`);
      setLoading(false);
    }
  };

  const getDoc = useCallback(async () => {
    const text = await getFireBaseDetails(ownerId ?? "", title ?? "");
    setNote(text);
  }, []);

  useEffect(() => {
    if (id === ownerId) {
      const noteId = getKeys(notes ? notes : {}).filter(
        (key) => notes && notes[key].title === title
      )[0];
      setNoteId(Number(noteId));
      if (noteId) {
        setNote(notes ? notes[noteId].text : "");
        setReadOnly(false);
      } else {
        showAlert("Document doesn't exist", {
          variant: "error",
        });
        navigate("/documents", { replace: true });
      }
    } else {
      getDoc();
    }
  }, []);

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(
        getItem(`NovaNote (${title})`)
          ? (getItem(`NovaNote (${title})`) as string)
          : note
      );
      quill.enable(!readOnly);
      quill.on("text-change", () => {
        setItem(`NovaNote (${title})`, quill.root.innerHTML);
      });
    }
  }, [quill]);

  return (
    <Box component="section">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5em",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.5em",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5em",
            alignItems: "baseline",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            fontWeight={600}
            marginBottom={0.5}
          >
            {title}
          </Typography>
          {readOnly ? (
            <p className={styles.read}>(Read Only)</p>
          ) : (
            <button
              title="Edit title"
              className={styles.btn}
              onClick={openEditTitleModal}
            >
              <MdEdit />
            </button>
          )}
        </div>
        {!readOnly && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5em",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                minWidth: "6em",
                paddingBlock: "0.4em",
              }}
              onClick={handleCloseDocument}
            >
              Close
            </Button>
            <Button
              variant="contained"
              sx={{
                minWidth: "6em",
              }}
              onClick={handleSaveDocument}
            >
              {!loading ? (
                <Box component="span">Save</Box>
              ) : (
                <Box
                  sx={{ display: "flex" }}
                  color={theme.palette.background.default}
                >
                  <CircularProgress color="inherit" size={25} />
                </Box>
              )}
            </Button>
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: "2em",
          maxWidth: "90dvw",
        }}
      >
        <div
          ref={quillRef}
          style={{
            minHeight: "69dvh",
            width: "100%",
          }}
          className={styles.body}
        />
      </div>
      {editTitleModal}
    </Box>
  );
}
