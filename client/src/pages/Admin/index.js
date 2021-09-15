import React, { useState } from 'react';
import axios from 'axios';
import Table from './table';
import {Spinner} from 'reactstrap';

const Home = () => {
  const [isProcessing, setIsProcessing] = useState(false)

  const setMultiNfts = () => {
    let tokenIds = [1, 2, 3];
    let tokenURIs = [];
    axios.post("/api/getMultiTokenURIs", {tokenIds})
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <>
      {/* <Table /> */}
      <section style={{ minHeight: '60vh' }} className="mt-5 pb-5">
        <div className="row">
          <div className="col-lg-5 mx-auto text-center">
            <button
              className="btn btn-primary ml-5 px-5 btn-sm-block"
              onClick={setMultiNfts}
            >
              {' '}
              {!isProcessing ? 'Reset NFT Images' : <Spinner size="sm" />}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
