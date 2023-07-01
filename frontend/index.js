// React
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { createRoot } from 'react-dom/client';
// NEAR
import { Wallet } from './near-wallet';
import LandingPage from './pages/LandingPage';

const CONTRACT_ADDRESS = process.env.CONTRACT_NAME;


// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS });


const container = document.getElementById('root');
const root = createRoot(container);
// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp();

  const router = createHashRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/app",
      element: <App isSignedIn={isSignedIn} contractId={CONTRACT_ADDRESS} wallet={wallet} />,
    },
  ]);
  root.render(<RouterProvider router={router} />);
}