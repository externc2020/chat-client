import React, {useState, useRef, useEffect} from 'react';
import {Container, Button, TextField, Grid, Typography, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  sendbox: {
    // margin: theme.spacing.unit,
    // position: "fixed",
    // bottom: theme.spacing.unit * 2,
  },
  chatbox: {
    borderRight: '1px solid lightgray',
    // border: '1px solid red',
    minHeight: '300px',
  }
}));

const App = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [connected, setConnected] = useState(false)
  const [nickname, setNickname] = useState("anonymous")
  const ws = useRef(null)
  const classes = useStyles();

  function wsUri() {
    let loc = window.location, new_uri;
    if (loc.protocol === 'https:') {
      new_uri = "wss://";
    } else {
      new_uri = "ws://";
    }
    new_uri += loc.host + "/ws";
    console.log(new_uri);
    return new_uri
  }

  useEffect(() => {
    ws.current = new WebSocket(wsUri())
    ws.current.onopen = () => {
      console.log("open")
      setConnected(true)
    }
    ws.current.onmessage = (e) => {
      console.log(e.data)
      setMessages(prev => [...prev, e.data])
    }
    ws.current.onclose = () => {
      console.log("close")
      setConnected(false)
    }
    ws.current.onerror = (e) => {
      console.error("error", e)
    }
    return () => ws.current.close()
  }, []);

  return (
    <Container maxWidth="sm">
      <Grid container spacing={3}>
        <Grid item sm={9}>
          <div className={classes.chatbox}>
            {messages.map((m, i) => (<div key={i}>{m}</div>))}
          </div>
          <div className={classes.sendbox}>
            <TextField value={message} onChange={(e) => setMessage(e.target.value)}/>
            <Button onClick={() => {
              if (nickname && message) {
                let m = nickname + ': ' + message
                setMessages(prev => [...prev, m])
                ws.current.send(m)
                setMessage("")
              }
            }} disabled={!connected} variant="contained" color="primary" disableElevation>Send</Button>
          </div>
        </Grid>
        <Grid item sm={3}>
          <div>
            <Typography variant="h6" component="h2">State</Typography>
            {connected ? <div>Chat server connected!</div> : <div>Connecting...</div>}
          </div>
          <div>
            <Typography variant="h6" component="h2">Nickname</Typography>
            <TextField value={nickname} onChange={(e) => setNickname(e.target.value)}/>
          </div>
          <div>
            <Typography variant="h6" component="h2">Members</Typography>
            <div>...</div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
