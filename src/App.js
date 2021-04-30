import React, {useState, useRef, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const App = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [connected, setConnected] = useState(false)
  const [nickname, setNickname] = useState("alice")
  const ws = useRef(null)

  useEffect(() => {
    // ws.current = new WebSocket("ws://localhost:8080/ws")
    ws.current = new WebSocket("wss://e9b6e8fa172e.ngrok.io/ws")
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
    <div className="App">
      {connected && <div>Chat server connected!</div>}
      <TextField label="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)}/>
      <div>
        {messages.map((m, i) => (<div key={i}>{m}</div>))}
      </div>
      <div>
        
        <TextField value={message} onChange={(e) => setMessage(e.target.value)}/>
        <Button onClick={() => {
          if (nickname && message) {
            let m = nickname + ': ' + message
            setMessages(prev => [...prev, m])
            ws.current.send(m)
            setMessage("")
          }
        }}>Send</Button>
      </div>
    </div>
  );
}

export default App;
