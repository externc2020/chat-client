import React, {useEffect, useRef, useState} from 'react'
import {Button, Container, Grid, Typography, Chip, Avatar} from "@material-ui/core"
import './index.css'
import {aes256} from 'aes-wasm'
import ed25519 from 'ed25519-wasm-pro'
import MessageEditor from "./MessageEditor"
import _sodium from 'libsodium-wrappers'

function randomAvatar() {
  let n = Math.floor(Math.random() * 3) + 1
  return `https://material-ui.com/static/images/avatar/${n}.jpg`
}

const Message = ({author, content}) => {
  return (
    <Grid container spacing={1} alignItems="flex-end">
      <Grid item>
        <Avatar alt="nickname" src={randomAvatar()}/>
      </Grid>
      <Grid item>
        <div style={{border: '1px solid #eee', padding: 10, borderRadius: 5, minWidth: 300, background: "white"}}>
          <div>{content.value}</div>
        </div>
      </Grid>
    </Grid>
  )
}

const ConnectionIndicator = ({ws, onMessage}) => {
  const [connecting, setConnecting] = useState(true)
  const [connected, setConnected] = useState(false)

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
    setConnecting(true)

    document.cookie = "pubkey=" + localStorage.getItem("pubkey")
    let w = new WebSocket(wsUri())
    w.onopen = (e) => {
      setConnecting(false)
      setConnected(true)
    }
    w.onmessage = (e) => {
      onMessage(e.data)
    }
    w.onclose = (e) => {
      console.log("close", e.code, "reason:", e.reason)
      setConnecting(false)
      setConnected(false)
    }

    ws.current = w

    return () => w.close()
  }, [ws, onMessage]);

  return (
    <div>
      {connecting ? <div>Connecting...</div>
        : connected ? (
            <div>
              <Chip size="small" label="Connected"/>
            </div>
          )
          : (
            <div>
              <Chip size="small" label="Disconnected" color="secondary"/>
              <Button variant="contained" color="primary" disableElevation size="small">Reconnect</Button>
            </div>
          )
      }
    </div>
  )
}

const Chat = () => {
  const [messages, setMessages] = useState([
    {author: {nickname: "alice"}, content: {type: "text", value: "hello from alice"}},
    {author: {nickname: "bob"}, content: {type: "text", value: "hello from bob"}},
  ])
  const ws = useRef(null)

  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      // sign message => message + signature
      // encrypt => aes
      console.log("send", message)

      let pubkey = Buffer.from(localStorage.getItem("pubkey"), "base64")
      let prikey = Buffer.from(localStorage.getItem("prikey"), "base64")

      console.log(pubkey)
      console.log(prikey)

      let payload = {
        type: "TextMessage",
        content: message,
      }

      // serialize payload to bytes
      let data = Buffer.concat([Buffer.of(0), Buffer.from(message)])
      console.log("data", data)

      let sig = Buffer.from(ed25519.sign(data, pubkey, prikey))
      console.log("sig", sig)

      let chunk = Buffer.concat([sig, data])
      console.log("chunk", chunk)

      _sodium.ready.then(() => {

        const sodium = _sodium;

        // let key = sodium.crypto_secretstream_xchacha20poly1305_keygen();
        let key = Buffer.from([194, 24, 60, 220, 15, 204, 153, 220, 154, 9, 122, 28, 40, 212, 47, 132, 87, 47, 146, 144, 185, 127, 26, 164, 29, 6, 37, 80, 31, 230, 207, 137])
        console.log("key", key) // 32 bytes

        // encrypt
        let res = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
        let [state_out, header] = [res.state, res.header];
        let c1 = sodium.crypto_secretstream_xchacha20poly1305_push(state_out,
          chunk, null,
          sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE);
        console.log("c1", c1)

        ws.current.send(c1)

        let m = {
          author: localStorage.getItem("pubkey"),
          content: {
            type: "text",
            value: message
          }
        }
        setMessages(prev => [...prev, m])
        resolve()

        // decrypt
        // let state_in = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key);
        // let r1 = sodium.crypto_secretstream_xchacha20poly1305_pull(state_in, c1);
        // let m1 = r1.message

        // console.log(m1);

      })
    })
  }

  return (
    <Container maxWidth="xl" style={{padding: 20}}>
      <Grid container spacing={3}>
        <Grid item sm={9}>
          <div>
            {messages.map((m, i) => (<Message key={i} author={m.author} content={m.content}>{m}</Message>))}
          </div>
          <MessageEditor sendMessage={sendMessage}/>
        </Grid>
        <Grid item sm={3}>
          <div className="infoItem">
            <Typography variant="h6" component="h2">Relay Network</Typography>
            <ConnectionIndicator ws={ws} onMessage={(msg) => {
              setMessages(prev => [...prev, msg])
            }}/>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Chat;
