import React, {useState} from 'react';
import {Button, Grid, AppBar, Toolbar, Typography, IconButton, makeStyles} from '@material-ui/core'
import {Menu as MenuIcon} from '@material-ui/icons'
import {useHistory} from 'react-router-dom';
import ed25519 from 'ed25519-wasm-pro';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Settings = () => {

  const [key, setKey] = useState(localStorage.getItem("pubkey") || "");
  const classes = useStyles();
  const history = useHistory();

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
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Settings
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container direction="column">
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => history.push("/")}>Back to Chat</Button>
        </Grid>
        <Grid item>
          <div>Public Key:</div>
          <div>
            {key && <code>{key}</code>}
          </div>
          <div>
            {
              key ?
                <Button onClick={createKeys} variant="contained" color="primary">Change Identity</Button>
                :
                <Button onClick={createKeys} variant="contained" color="primary">New Identity</Button>
            }
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Settings;
