import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useDropzone} from 'react-dropzone';
import {NFTStorage} from 'nft.storage';
import Web3 from 'web3';
import {Spinner} from 'reactstrap';
import {toast} from 'react-toastify';
import { NFTStorageKey, CollectionAddress } from '../../constants';
import { useBeforeunload } from 'react-beforeunload';

import {
  _isMetaMaskInstalled,
  _isValidChainId,
  getDefaultAddres,
  getNFTContractInstance,
} from '../../utils/web3';
import restApi from '../../utils/restApi';
const client = new NFTStorage({token: NFTStorageKey});

const Create = () => {
  const web3 = useSelector((state) => state.web3);
  const [assetType, setAssetType] = useState('image');
  const [name, setName] = useState('');
  const [description, setDescription] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const length = 1;
  
  useBeforeunload((event) => {
    if (isProcessing) {
      event.preventDefault();
    }
  });

  // Create NFT
  const createNFT = async (e) => {
    e.preventDefault();
    const isValidNetwork = await _isValidChainId();
    if (!isValidNetwork) {
      toast.error(
        'Unsupported network. Please change your network into BSC Testnet '
      );
      return;
    }
    if (name === '') {
      toast.error('Please input Name');
      return;
    }
    if (description === '') {
      toast.error('Please input description');
      return;
    }
    setIsProcessing(true);
    // const result = await ipfs.files.add(Buffer.from(buffer));
    // const cid = await client.storeDirectory([
    //   new File(
    //     [
    //       JSON.stringify({
    //         name: name,
    //         description: description,
    //         assetType: assetType,
    //         // image: `https://ipfs.io/ipfs/${result[0].hash}`,
    //         image: `https://ipfs.io/ipfs/QmT3vmBsVnrfMtLWCiyx7GyFdnbrL2aKD2xbYydHeUUmth`,
    //       }),
    //     ],
    //     'metadata.json'
    //   ),
    // ]);
    const {ethereum} = window;
    const web3 = new Web3(ethereum);
    try {
      const nftContract = getNFTContractInstance(CollectionAddress);
      const userAddress = await getDefaultAddres();

      const tokenURI = `none`;
      const tx = await nftContract.methods
      .mint(
          userAddress,
          length,
          tokenURI,
          // currency,
          // calculatedPrice,
          // nftStatus,
          // calculatedRoyalty
        )
        .send({from: userAddress});
      console.log('=== token TxHash ===', tx);
      const tokenId = tx.events.Transfer.returnValues.tokenId;
      await restApi.post('/save_item', {
          tokenId: length,
          collectionId: CollectionAddress,
          pairKey: '',
          name: name,
          metadata: tokenURI,
          // image: `https://ipfs.io/ipfs/${result[0].hash}`,
          image: `https://ipfs.io/ipfs/tokenURI`,
          creator: userAddress.toLowerCase(),
          owner: userAddress.toLowerCase(),
          description: description,
          txHash: tx.txHash,
      })
     
      toast.success('NFT created successfully');
      setIsProcessing(false);
      window.location.href = '/profile';
    } catch (err) {
      setIsProcessing(false);
      let message = err.message
        ? err.message
        : `Transaction Failed. Please make sure you have sufficient balance and Minimum Balance`;
      toast.error(message);
      console.error(err);
      return;
    }
  };

  const resetToken = async () => {
    const cid = await client.storeDirectory([
      new File(
        [
          JSON.stringify({
            name: "tset",
            description: "tsetas",
            assetType: "image",
            // image: `https://ipfs.io/ipfs/${result[0].hash}`,
            image: `https://ipfs.io/ipfs/QmT3vmBsVnrfMtLWCiyx7GyFdnbrL2aKD2xbYydHeUUmth`,
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
          length,
          tokenURI
        )
        .send({from: userAddress});
      console.log('=== token TxHash ===', tx);
      await restApi.post('/update_item', {
        tokenId: length,
        metadata: tokenURI,
        // image: `https://ipfs.io/ipfs/${result[0].hash}`,
        image: `https://ipfs.io/ipfs/QmT3vmBsVnrfMtLWCiyx7GyFdnbrL2aKD2xbYydHeUUmth`,
    })
    }
    catch (err) {
      console.log(err);
    }
  }

  const getToken = async () => {
    try {
      const nftContract = getNFTContractInstance(CollectionAddress);
      const userAddress = await getDefaultAddres();
      const tx = await nftContract.methods
      .tokenURI(
          length
        )
        .send({from: userAddress});
      console.log('=== token TxHash ===', tx);
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <section className="pb-5 mt-5">
      <div className="container">
        <div className="row mb-4">
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
                
                <button
                  className="btn btn-primary ml-5 px-5 btn-sm-block"
                  onClick={createNFT}
                >
                  {' '}
                  {!isProcessing ? 'CREAT NFT' : <Spinner size="sm" />}
                </button>
                {/* <button
                  className="btn btn-primary ml-5 px-5 btn-sm-block"
                  onClick={resetToken}
                >Test
                </button>
                <button
                  className="btn btn-primary ml-5 px-5 btn-sm-block"
                  onClick={getToken}
                >getItem
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
