import * as React from 'react';
import * as ReactDOM from "react-dom";

import App from './App';
import "./styles.css";

import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App/>);