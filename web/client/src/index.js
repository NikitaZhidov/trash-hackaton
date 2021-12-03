import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import 'leaflet/dist/leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'normalize.css';
import './styles/global.scss';
import './styles/leaflet-overrides.scss';

ReactDOM.render(<App />, document.getElementById('root'));
