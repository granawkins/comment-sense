import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import { Auth0Provider } from "@auth0/auth0-react"

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// ReactDOM.render(
//   <Auth0Provider
//     domain="dev-o68rln01.us.auth0.com"
//     clientId="7YRTrvXYhEpZk2jQHyHm7HQmu4ukKhlD"
//     redirectUri='http://localhost:3000/dashboard/videos'
//   >
//     <App />
//   </Auth0Provider>,
//   document.getElementById('root')
// );
