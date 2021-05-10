import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {CssBaseline, ThemeProvider, createMuiTheme} from "@material-ui/core"
import "./index.css"

const theme = createMuiTheme({
  // overrides: {
  //   MuiCssBaseline: {
  //     '@global': {
  //       html: {
  //         overflow: "hidden",
  //         body: {
  //           overflow: "hidden",
  //           height: "100vh",
  //         }
  //       }
  //     }
  //   }
  // },
  palette: {
    primary: {
      main: '#0277bd',
    },
    secondary: {
      main: '#ff3d00',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <App/>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
