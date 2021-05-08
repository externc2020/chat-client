import React, {useState} from 'react';
import {Button, Container} from '@material-ui/core'
import ed25519 from 'ed25519-wasm-pro';

const Settings = () => {

  const [key, setKey] = useState(null);

  function createKeys() {
    let seed = ed25519.createSeed();
    let keys = ed25519.createKeyPair(seed);
    let pubkey = Buffer.from(keys.publicKey).toString('base64')
    let prikey = Buffer.from(keys.secretKey).toString('base64')
    localStorage.setItem("pubkey", pubkey)
    localStorage.setItem("prikey", prikey)
    setKey(pubkey)
  }

  return (
    <Container maxWidth="xl" style={{padding: 20, minHeight: '100vh'}}>
      <div>
        <div>Public Key:</div>
        <div>
          {key && <code>{key}</code>}
        </div>
        <div>
          <Button onClick={createKeys} variant="contained" color="primary">New Identity</Button>
        </div>
      </div>
    </Container>
  )
}

export default Settings;
