import React, {useState} from 'react'
import {Button, Grid, TextField} from "@material-ui/core";

const MessageEditor = ({sendMessage}) => {
  const [message, setMessage] = useState("")

  return (
    <Grid container spacing={3}>
      <Grid item sm={10}>
        <TextField
          fullWidth
          variant="outlined" rows={1} multiline
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "enter") {
              sendMessage(message).then(setMessage(""))
            }
          }}
        />
      </Grid>
      <Grid item sm={2}>
        <Button
          onClick={() => sendMessage(message).then(setMessage(""))}
          // disabled={!connected}
          variant="contained" color="primary" disableElevation
        >Send</Button>
      </Grid>
    </Grid>
  )
}

export default MessageEditor
