import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './table';
import {Spinner} from 'reactstrap';
import {NFTStorage} from 'nft.storage';
import {toast} from 'react-toastify';

import {
  _isMetaMaskInstalled,
  _isValidChainId,
  getDefaultAddres,
  getNFTContractInstance,
} from '../../utils/web3';
import { NFTStorageKey, CollectionAddress, OpenseaApiUrl } from '../../constants';

const client = new NFTStorage({token: NFTStorageKey});

const Home = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMultiProcessing, setIsMutliProcessing] = useState(false)
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(1);
  const [tokenId, setTokenId] = useState(0);
  const [totalCount, setTotalCount] = useState(-1);

  useEffect(() => {
    axios.get("/api/getTotalCount")
    .then(res => {
      setTotalCount(res.data);
    })
    .catch(err => {
      console.log(err);
    })
  }, );

  const setMultiNfts = async () => {
    let tokenIds = [];
    for (let i = start; i <= end; i++) {
      tokenIds.push(i);
    }
    let tokenURIs = [];
    let imageResults = [];
    setIsMutliProcessing(true)
    axios.post("/api/getMultiTokenURIs", {tokenIds})
    .then( async res => {
      console.log(res);
      imageResults = res.data.data;
      // imageResults = [
      //   "QmdGWScpBZzq8vv8AXgWrnxcdYpBdKXddoob947VAiJYHt",
      //   "QmWCZU8BBsegVdLR6xNzNmkGfPFM1Q7BRXZHJ8Y23xwSva",
      //   "Qmf8rVgo2NZRVTvyv5nwEfzF8Z9ex8q4aentF8dgfhbQCX"
      // ];
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

        // force_update on openseas.
        for (let i = 0; i < tokenIds.length; i++) {
          let url = `${OpenseaApiUrl}/asset/${CollectionAddress.toLocaleLowerCase()}/${tokenIds[i]}?force_update=true`;
          await axios.get(url)
          .then( async res => {
            await delay(1500)
          })
          .catch(err => {
            console.log(err)
          });
          console.log("test**", i);
        }

        // update server data
        await axios.post('/api/updateMultiItem', {
          tokenIds: tokenIds,
          tokenURIs: tokenURIs,
          imageResults: imageResults,
        })
        .then(res => {
          setIsMutliProcessing(false)
        })
        .catch(err => {
          setIsMutliProcessing(false)
          console.log(err)
        })
        setIsMutliProcessing(false)
      } catch (err) {
        setIsMutliProcessing(false)
        console.log(err);
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  const setOneNft = async () => {
    setIsProcessing(true)
    axios.post("/api/getFileBuffer", {tokenId})
    .then( async res => {
      console.log(res);
      let result = res.data.result;
      const cid = await client.storeDirectory([
        new File(
          [
            JSON.stringify({
              name: "teenager1",
              description: "descirption",
              assetType: "image",
              image: `https://ipfs.io/ipfs/${result[0].hash}`,
              // image: `https://ipfs.io/ipfs/Qmf8rVgo2NZRVTvyv5nwEfzF8Z9ex8q4aentF8dgfhbQCX`,
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

        let url = `${OpenseaApiUrl}/asset/${CollectionAddress.toLocaleLowerCase()}/${tokenId}?force_update=true`;
        await axios.get(url)
        .then( async res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        });

        await axios.post('/api/update_item', {
          tokenId: tokenId,
          metadata: tokenURI,
          image: `https://ipfs.io/ipfs/${result[0].hash}`,
          // image: `https://ipfs.io/ipfs/Qmf8rVgo2NZRVTvyv5nwEfzF8Z9ex8q4aentF8dgfhbQCX`,
        })
        .then(res => {
          setIsProcessing(false)
        })
        .catch(err => {
          setIsProcessing(false)
          console.log(err)
        })
      }
      catch (err) {
        setIsProcessing(false)
        console.log(err);
      }
    }) 
    .catch( err => {
      console.log(err)
    })
  }

  const delay = (milisec) => {
    return new Promise(resolve => {
      setTimeout(() => { resolve('') }, milisec);
    })
  }

  return (
    <>
      {/* <Table /> */}
      <section style={{ minHeight: '60vh' }} className="mt-5 pb-5">
        <div className="row">
          <div className="row text-center mx-auto">
            <h2>set multiple nft token images</h2>
          </div>
          <div className="row text-center mx-auto">
            <div className="mt-5 col-lg-3"></div>
            <div className="mt-5 col-lg-3">
              <h6 className="mb-3"> start </h6>
              <div className="group-input mb-3">
                <input
                  type="number"
                  placeholder="Start token ID"
                  className="form-air"
                  value={start}
                  onChange={(e) => {
                    if (e.target.value < 1) {
                      toast.warning('this is bigger than 1');
                      setStart(0)
                      return;
                    }
                    if (e.target.value > end) {
                      toast.warning(`this is smaller than end`);
                      setStart(0)
                      return;
                    }
                    setStart(e.target.value)
                  }}
                />
              </div>
            </div>
            <div className="mt-5 col-lg-3">
              <h6 className="mb-3"> end </h6>
              <div className="group-input mb-3">
                <input
                  type="number"
                  placeholder="End token ID"
                  className="form-air"
                  value={end}
                  onChange={(e) => {
                    if (e.target.value > totalCount) {
                      toast.warning(`this is smaller than ${totalCount}`);
                      setEnd(0)
                      return;
                    }

                    if (e.target.value <= start) {
                      toast.warning(`this is bigger than start`);
                      setEnd(start)
                      return;
                    }
                    setEnd(e.target.value)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12 mx-auto text-center">
            <button
              className="btn btn-primary ml-5 px-5 btn-sm-block"
              onClick={setMultiNfts}
            >
              {' '}
              {!isMultiProcessing ? 'Reset NFT Images' : <Spinner size="sm" />}
            </button>
          </div>
          <div className="row text-center mx-auto mt-5">
            <h2>reset one nft token image</h2>
          </div>
          <div className="row text-center mx-auto">
            <div className="mt-5 col-lg-4"></div>
            <div className="mt-5 col-lg-4">
              <h6 className="mb-3"> TokenID </h6>
              <div className="group-input mb-3">
                <input
                  type="number"
                  placeholder="token ID"
                  className="form-air"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12 mx-auto text-center">
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
