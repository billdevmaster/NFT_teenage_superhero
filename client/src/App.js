import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Publish from './pages/Create';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import {updateAccount, updateChainId} from './actions/web3';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const CloseButton = ({closeToast}) => (
    <i onClick={closeToast} className="la la-close notifications-close" />
  );
  useEffect(() => {
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        window.ethereum.on('chainChanged', (_chainId) => {
          dispatch(updateChainId(parseInt(Number(_chainId), 10)));
        });
        window.ethereum.on('accountsChanged', (accounts) => {
          dispatch(updateAccount(accounts[0]));
        });
      }
    });
  });
  return (
    <>
      <Header />
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/create" component={Publish} />
          <Route exact path="/teheadmin" component={Admin} />
          <Route path="/profile/:account?" component={Profile} />
        </Switch>
      </Router>
      <Footer />
      <ToastContainer
        autoClose={5000}
        hideProgressBar
        closeButton={<CloseButton />}
      />
    </>
  );
};

export default App;
