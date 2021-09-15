import React, { useState } from 'react';
import axios from 'axios';
import Table from './table';
import {Spinner} from 'reactstrap';
import {NFTStorage} from 'nft.storage';

import {
  _isMetaMaskInstalled,
  _isValidChainId,
  getDefaultAddres,
  getNFTContractInstance,
} from '../../utils/web3';
import { NFTStorageKey, CollectionAddress } from '../../constants';

const client = new NFTStorage({token: NFTStorageKey});

const Home = () => {
  const [isProcessing, setIsProcessing] = useState(false)

  const setMultiNfts = async () => {
    let tokenIds = [1, 2, 3];
    let tokenURIs = [];
    let imageResults = [];
    // axios.post("/api/getMultiTokenURIs", {tokenIds})
    // .then( async res => {
    //   console.log(res);
      // imageResults = res.data.data;
      imageResults = [
        "QmdGWScpBZzq8vv8AXgWrnxcdYpBdKXddoob947VAiJYHt",
        "QmWCZU8BBsegVdLR6xNzNmkGfPFM1Q7BRXZHJ8Y23xwSva",
        "Qmf8rVgo2NZRVTvyv5nwEfzF8Z9ex8q4aentF8dgfhbQCX"
      ];
      for (let i = 0; i < tokenIds.length; i++) {
        const cid = await client.storeDirectory([
          new File(
            [
              JSON.stringify({
                name: "teenager1",
                description: "descirption",
                assetType: "image",
                image: `https://ipfs.io/ipfs/${imageResults[i]}`,
              }),
            ],
            'metadata.json'
          ),
        ]);
        tokenURIs.push(`https://ipfs.io/ipfs/${cid}/metadata.json`)
      }
      console.log(tokenURIs);
      try {
        const nftContract = getNFTContractInstance(CollectionAddress);
        const userAddress = await getDefaultAddres();
        // const tokenURI = `https://ipfs.io/ipfs/${cid}/metadata.json`;
        const tx = await nftContract.methods
        .setMultiTokenURIs(
            tokenIds,
            tokenURIs,
          )
          .send({from: userAddress});
        
        console.log('=== token TxHash ===', tx);
      } catch (err) {
        console.log(err);
      }
    // })
    // .catch(err => {
    //   console.log(err)
    // })
  }

  const setOneNft = async () => {
    setIsProcessing(true)
    const tokenId = 3
    // axios.post("/api/getFileBuffer", {tokenId})
    // .then(async res => {
    //   let result = res.data.result
      const cid = await client.storeDirectory([
        new File(
          [
            JSON.stringify({
              name: "teenager1",
              description: "descirption",
              assetType: "image",
              // image: `https://ipfs.io/ipfs/${result[0].hash}`,
              image: `https://ipfs.io/ipfs/Qmf8rVgo2NZRVTvyv5nwEfzF8Z9ex8q4aentF8dgfhbQCX`,
            }),
          ],
          'metadata.json'
        ),
      ]);
      try {
        const tokenURI = `https://ipfs.io/ipfs/${cid}/metadata.json`;
        const nftContract = getNFTContractInstance(CollectionAddress);
        const userAddress = await getDefaultAddres();
        const tx = await nftContract.methods
        .setTokenURI(
            tokenId,
            tokenURI
          )
          .send({from: userAddress});
        console.log('=== token TxHash ===', tx);
        await axios.post('/api/update_item', {
          tokenId: tokenId,
          metadata: tokenURI,
          // image: `https://ipfs.io/ipfs/${result[0].hash}`,
          image: `https://ipfs.io/ipfs/Qmf8rVgo2NZRVTvyv5nwEfzF8Z9ex8q4aentF8dgfhbQCX`,
        })
      }
      catch (err) {
        console.log(err);
      }
    // }) 
    // .catch( err => {
    //   console.log(err)
    // })
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
            <button
              className="btn btn-secondary ml-5 px-5 btn-sm-block"
              onClick={setOneNft}
            >
              {' '}
              {!isProcessing ? 'Reset One NFT image' : <Spinner size="sm" />}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
