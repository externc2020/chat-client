import React, {useState} from 'react'
import {Editor, EditorState} from "draft-js"
import "draft-js/dist/Draft.css"
import {Attachment, Attachment as AttachmentIcon, Send as SendIcon} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";


const MessageEditor = ({sendMessage}) => {
  const [message, setMessage] = useState("")
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const editor = React.useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  return (
    <div style={{padding: 8, width: "100%", display: "flex"}}>
      <div
        style={{
          borderRadius: 3,
          minHeight: "1em",
          cursor: "text",
          backgroundColor: 'white',
          padding: 4,
          flexGrow: 1,
        }}
        onClick={focusEditor}
      >
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
        />
      </div>
      <div>
        <IconButton size="small">
          <AttachmentIcon/>
        </IconButton>
        <IconButton size="small">
          <SendIcon/>
        </IconButton>
      </div>
    </div>
  )
}

export default MessageEditor
