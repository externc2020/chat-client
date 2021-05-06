import React, {useState, useRef, useEffect} from 'react';
import {Container, Button, TextField, Grid, Typography, makeStyles} from "@material-ui/core";
import './index.css';

const useStyles = makeStyles(theme => ({

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

  function sendMessage(event) {
    if (event.which === 13 && nickname && message) {
      let m = nickname + ': ' + message
      setMessages(prev => [...prev, m])
      ws.current.send(m)
      setMessage("")
    }
  }

  return (
    <Container maxWidth="xl" style={{ padding: 20, minHeight: '100vh' }}>
      <Grid container spacing={3}>
        <Grid item sm={9}>
          <div className="chatBox">
            <div className="chatItem">asdasdasadaasdasdasadaasdasdasadaasdasdasadaasdasdasadaasdasdasadaasdasdasada</div>
            <div className="chatItem">asdasdasada</div>
            <div className="chatItem">asdasdasada</div>
            {messages.map((m, i) => (<div className="chatItem" key={i}>{m}</div>))}
          </div>
          <Grid container spacing={3}>
            <Grid item sm={10}>
              <TextField
                  fullWidth
                  label="Share your message" variant="outlined" rows={3} multiline
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={sendMessage}
              />
            </Grid>
            <Grid item sm={2}>
              <Button
                  onClick={() => {
                    if (nickname && message) {
                      let m = nickname + ': ' + message
                      setMessages(prev => [...prev, m])
                      ws.current.send(m)
                      setMessage("")
                    }
                  }}
                  // disabled={!connected}
                  variant="contained" color="primary" disableElevation
              >Send</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={3}>
          <div className="infoItem">
            <Typography variant="h6" component="h2">State</Typography>
            {connected ? <div>Chat server connected!</div> : <div>Connecting...</div>}
          </div>
          <div className="infoItem">
            <Typography variant="h6" component="h2">Nickname</Typography>
            <TextField value={nickname} onChange={(e) => setNickname(e.target.value)}/>
          </div>
          <div className="infoItem">
            <Typography variant="h6" component="h2">Members</Typography>
            <div>...</div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
