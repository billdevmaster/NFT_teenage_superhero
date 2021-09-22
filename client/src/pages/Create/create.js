import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useDropzone} from 'react-dropzone';
import {NFTStorage} from 'nft.storage';
import Web3 from 'web3';
import {Spinner} from 'reactstrap';
import {toast} from 'react-toastify';
import {fs} from 'fs'
import { NFTStorageKey, CollectionAddress, OpenseaApiUrl } from '../../constants';
import { useBeforeunload } from 'react-beforeunload';
import IPFS from 'ipfs-api';

import {
  _isMetaMaskInstalled,
  _isValidChainId,
  getDefaultAddres,
  getNFTContractInstance,
} from '../../utils/web3';
import restApi from '../../utils/restApi';
import SampleImage from '../../assets/img/logo.jpg';
import axios from 'axios';

const client = new NFTStorage({token: NFTStorageKey});
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const Create = () => {
  const assetType = 'image';
  const web3 = useSelector((state) => state.web3);
  const [userAddress, setUserAddress] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalMintedCount, setTotalMintedCount] = useState(0);
  
  useBeforeunload((event) => {
    if (isProcessing) {
      event.preventDefault();
    }
  });

  useEffect(() => {
    setUserAddress(web3.userAccount);
  }, [web3.userAccount])

  useEffect(() => {
    axios.get("/api/getTotalCount")
    .then(res => {
      setTotalCount(res.data);
    })
    .catch(err => {
      console.log(err);
    });

    axios.post("/api/getMintedCount", {userAddress})
    .then(res => {
      setTotalMintedCount(res.data);
    })
    .catch(err => {
      console.log(err);
      toast.error("Server Error");
    })
  }, );

  // Create NFT
  const createNFT = async (e) => {
    e.preventDefault();
    const isValidNetwork = await _isValidChainId();
    if (!userAddress) {
      toast.error(
        'Connect metamask!'
      );
      return;
    }

    if (!isValidNetwork) {
      toast.error(
        'Unsupported network. Please change your network into Matic(Polygon) '
      );
      return;
    }

    // check user minted count is smaller than 10.
    if (totalMintedCount >= 10) {
      toast.warning("You have minted 10 NFTs, You can't mint NFT more");
      return;
    }

    // if (name === '') {
    //   toast.error('Please input Name');
    //   return;
    // }
    // if (description === '') {
    //   toast.error('Please input description');
    //   return;
    // }

    setIsProcessing(true);
    try {
      const cid = await client.storeDirectory([
        new File(
          [
            JSON.stringify({
              // name: `Teenage SupreHero${totalCount + 1}`,
              description: 'This is Teenage Superhero NFT',
              assetType: assetType,
              // image: `https://ipfs.io/ipfs/${result[0].hash}`,
              // image: `https://ipfs.io/ipfs/QmbKRhJRdpvN38tm2fMZsaDRjxGQc2xJhe2D1iwzrGq2mi`,
              image: `http://teenagehero.fun/sample.jpg`,
            }),
          ],
          'metadata.json'
        ),
      ]);
  
      try {
        const nftContract = getNFTContractInstance(CollectionAddress);
        const userAddress = await getDefaultAddres();
        const tokenURI = `https://ipfs.io/ipfs/${cid}/metadata.json`;
        const tx = await nftContract.methods
        .mint(
            userAddress,
            tokenURI,
          )
          .send({from: userAddress});
        
        console.log('=== token TxHash ===', tx);
        const tokenId = tx.events.Transfer.returnValues.tokenId

        await delay(2000);

        let url = `${OpenseaApiUrl}/asset/${CollectionAddress.toLocaleLowerCase()}/${tokenId}?force_update=true`;
        await axios.get(url)
        .then( async res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        });

        await axios.post('/api/save_item', {
            tokenId: tokenId,
            collectionId: CollectionAddress,
            name: name,
            metadata: tokenURI,
            // image: `https://ipfs.io/ipfs/${result[0].hash}`,
            image: `https://ipfs.io/ipfs/QmbKRhJRdpvN38tm2fMZsaDRjxGQc2xJhe2D1iwzrGq2mi`,
            creator: userAddress.toLowerCase(),
            owner: userAddress.toLowerCase(),
            description: description,
            txHash: tx.txHash,
        })
        
        toast.success('NFT created successfully');
        setIsProcessing(false);
        setTotalMintedCount(totalMintedCount + 1)
        setTotalCount(totalCount + 1)
      } catch (err) {
        setIsProcessing(false);
        let message = err.message
          ? err.message
          : `Transaction Failed. Please make sure you have sufficient balance and Minimum Balance`;
        toast.error(message);
        console.error(err);
        return;
      }
    } catch (err) {
        console.log(err)
    }
    // }
  };

  const resetToken = async () => {
    axios.get("/api/getFileBuffer")
    .then(async res => {
      let result = res.data.result
      const cid = await client.storeDirectory([
        new File(
          [
            JSON.stringify({
              name: "teenager1",
              description: "descirption",
              assetType: "image",
              image: `https://ipfs.io/ipfs/${result[0].hash}`,
              // image: `https://ipfs.io/ipfs/QmT3vmBsVnrfMtLWCiyx7GyFdnbrL2aKD2xbYydHeUUmth`,
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
            5,
            tokenURI
          )
          .send({from: userAddress});
        console.log('=== token TxHash ===', tx);
        await axios.post('/api/update_item', {
          tokenId: 5,
          metadata: tokenURI,
          image: `https://ipfs.io/ipfs/${result[0].hash}`,
          image: `https://ipfs.io/ipfs/QmT3vmBsVnrfMtLWCiyx7GyFdnbrL2aKD2xbYydHeUUmth`,
      })
      }
      catch (err) {
        console.log(err);
      }
    }) 
    .catch( err => {
      console.log(err)
    })
  }

  // const updateOnOpensea = async () => {
  //   let url = `${OpenseaApiUrl}/asset/${CollectionAddress.toLocaleLowerCase()}/${tokenId}?force_update=true`;
  //   await axios.get(url)
  //   .then( async res => {
  //     console.log(res)
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   });
  // }
  const delay = (milisec) => {
    return new Promise(resolve => {
      setTimeout(() => { resolve('') }, milisec);
    })
  }
  return (
    <section className="pb-5 mt-5" style={{ minHeight: '60vh' }}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <p>Total Count of NFT is {totalCount}.    You minted {totalMintedCount} NFTs.</p>
            {totalMintedCount >= 10 ? (
              <p style={{color: 'red'}}>You minted 10 NFTs, you can't mint more.</p>
            ):''}
          </div>
          <div className="col-12">
            <div className="section-title" style={{display: 'flex'}}>
              <h2 className="section-heading section-heading-after">
                Create Single NFT 
              </h2>
              {/* <h4>(limited 10)</h4> */}
            </div>
          </div>
        </div>
        <div className="row" >
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div>
              <div className="tabs-g">
                <nav className="nav nav-tabs border-0 row" role="tablist">
                  <div
                    className="tab-pane fade show active"
                    id="tab__fixedprice"
                  >
                    {/* <div className="mt-5">
                      <h6 className="mb-3"> Title </h6>
                      <div className="group-input mb-3">
                        <input
                          type="text"
                          placeholder="Title of Your NFT"
                          className="form-air"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <h6 className="mb-3"> Description </h6>
                      <div className="group-input mb-3">
                        <textarea
                          placeholder="A short description of your NFT"
                          className="form-air"
                          rows="3"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div> */}
                  </div>
                </nav>
                <button
                  className="btn btn-primary ml-5 px-5 btn-sm-block"
                  onClick={createNFT}
                  disabled={totalMintedCount >= 10 ? true : false}
                >
                  {' '}
                  {!isProcessing ? 'CREAT NFT' : <Spinner size="sm" />}
                </button>
                {/* <button
                  className="btn btn-primary ml-5 px-5 btn-sm-block"
                  onClick={updateOnOpensea}
                >Update On Opensea
                </button> */}
              </div>
            </div>
          </div>
          </div>
      </div>
    </section>
  );
};

export default Create;
