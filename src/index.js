import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RecentSongs from './components/recentsongs';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RecentSongs />
  </React.StrictMode>
);

// to get this app working go to /login and it will display your recent songs 