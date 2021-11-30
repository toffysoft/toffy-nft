import * as React from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import _ from 'lodash';
import { convertUtf8ToHex } from '@walletconnect/utils';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider';
// @ts-ignore
import Fortmatic from 'fortmatic';
import Torus from '@toruslabs/torus-embed';
import Authereum from 'authereum';
import { Bitski } from 'bitski';

import Button from './components/Button';
import Column from './components/Column';
import Wrapper from './components/Wrapper';
import Modal from './components/Modal';
import Header from './components/Header';
import Loader from './components/Loader';
import ModalResult from './components/ModalResult';
import AccountAssets from './components/AccountAssets';
import ConnectButton from './components/ConnectButton';

import { apiGetAccountAssets } from './helpers/api';
import {
  hashPersonalMessage,
  recoverPublicKey,
  recoverPersonalSignature,
  formatTestTransaction,
  getChainData,
} from './helpers/utilities';

import { fonts } from './styles';
import { openBox, getProfile } from './helpers/box';
import {
  ETH_SEND_TRANSACTION,
  ETH_SIGN,
  PERSONAL_SIGN,
  BOX_GET_PROFILE,
  DAI_BALANCE_OF,
  DAI_TRANSFER,
} from './constants';
import { callBalanceOf, callTransfer } from './helpers/web3';

import {
  tokenContract as tokenAddress,
  nftContract as nftAddress,
} from '../config';

import cassette from './assets/cassette.svg';
import toffysoft from './assets/toffysoft.png';
import Cassette from './components/Cassette';
// import Token from '../artifacts/contracts/Toffy.sol/Toffy.json';
import NFT from '../artifacts/contracts/ToffyNFT.sol/CassetteFactory.json';

const SLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  background-color: ${(props) => props.backgroundColor || '#ace7ff'};
  background-image: url(${(props) => props.backgroundImage});
  background-repeat: no-repeat;
  background-position: center;
`;

const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SLanding = styled(Column)`
  height: 600px;
  padding-top: 120px;
`;

const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`;

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`;

const SModalParagraph = styled.p`
  margin-top: 30px;
`;

// @ts-ignore
const SBalances = styled(SLanding)`
  height: 100%;
  & h3 {
    padding-top: 30px;
  }
`;

const STestButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const STestButton = styled(Button)`
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  height: 44px;
  width: 100%;
  max-width: 175px;
  margin: 12px;
  background-color: rgb(255, 255, 255);
  border: none;
  color: rgb(0, 0, 0);
`;

function initWeb3(provider) {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
}

function getProviderOptions() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID,
      },
    },
    // torus: {
    //   package: Torus,
    // },
    // fortmatic: {
    //   package: Fortmatic,
    //   options: {
    //     key: process.env.REACT_APP_FORTMATIC_KEY,
    //   },
    // },
    // authereum: {
    //   package: Authereum,
    // },
    // bitski: {
    //   package: Bitski,
    //   options: {
    //     clientId: process.env.REACT_APP_BITSKI_CLIENT_ID,
    //     callbackUrl: window.location.href + 'bitski-callback.html',
    //   },
    // },
  };

  return providerOptions;
}

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

const colors = [
  '#00ADB5',
  '#F9ED69',
  '#F08A5D',
  '#B83B5E',
  '#6A2C70',
  '#F38181',
  '#FCE38A',
  '#EAFFD0',
  '#95E1D3',
  '#08D9D6',
  '#FF2E63',
  '#53354A',
  '#903749',
  '#E84545',
  '#A7FF83',
  '#17B978',
  '#086972',
  '#94FC13',
  '#1df900',
  '#325288',
  '#FF165D',
  '#FF9A00',
  '#F6F7D7',
  '#3EC1D3',
  '#ace7ff',
  '#fff',
  '#1edfe2',
  '#755cff',
  '#fef55a',
  '#ff40fe',
];

function App(props) {
  const [chainId, setChainId] = React.useState(
    parseInt(process.env.REACT_APP_CHAIN_ID),
  );
  const [networkId, setNetworkId] = React.useState(
    parseInt(process.env.REACT_APP_CHAIN_ID),
  );

  const getNetwork = () => getChainData(chainId).network;

  const web3Modal = React.useRef(
    new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      // providerOptions: getProviderOptions(),
    }),
  );

  const intvl = React.useRef(null);
  const [fetching, setFetching] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [web3, setWeb3] = React.useState(null);
  const [provider, setProvider] = React.useState(null);
  const [connected, setConnected] = React.useState(false);
  const [assets, setAssets] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [pendingRequest, setPendingRequest] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [nftContract, setNftContract] = React.useState(null);
  // const [tokenContract, setTokenContract] = React.useState(null);
  const [web3Provider, setWeb3Provider] = React.useState(null);
  const [signer, setSigner] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const [bgColor, setBgColor] = React.useState(null);
  const [mintAble, setMintAble] = React.useState(false);
  const [isOwner, setIsOwner] = React.useState(false);
  const [whitelistTarget, setWhitelistTarget] = React.useState('');
  const [newOwnerTarget, setNewOwnerTarget] = React.useState('');
  const [available, setAvailable] = React.useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);

  const [cassetteStyle, setCassetteStyle] = React.useState({
    bg: '#ace7ff',
    head: '#fff',
    strip1: '#1edfe2',
    strip2: '#755cff',
    label: '#fef55a',
    body: '#ff40fe',
  });

  const onConnect = async () => {
    setFetching(true);
    try {
      const provider = await web3Modal.current.connect();

      const Web3 = initWeb3(provider);

      await subscribeProvider(provider, Web3);

      const accounts = await Web3.eth.getAccounts();

      const address = accounts[0];

      const networkId = await Web3.eth.net.getId();

      const chainId = await Web3.eth.chainId();
      setConnected(true);
      setAddress(address);
      setChainId(chainId);
      setNetworkId(networkId);

      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();

      const nftContract = new ethers.Contract(nftAddress, NFT.abi, signer);

      // const data = await nftContract.balanceOf(accounts[0]);
      const isWhitelisted = await nftContract.isWhitelisted(accounts[0]);
      // const totalSupply = await nftContract.totalSupply();
      const owner = await nftContract.owner();
      const token = {};

      // const myContract = new Web3.eth.Contract(NFT.abi, nftContract.address);

      // console.log({
      //   provider,
      //   web3Provider,
      //   signer,
      //   owner,
      //   nftContract,
      //   // tokenContract,
      //   // data,
      //   isWhitelisted,
      //   totalSupply: totalSupply.toString(),
      //   myContract,
      // });

      // const events = await myContract.getPastEvents('Transfer', {
      //   filter: {
      //     _from: '0x0000000000000000000000000000000000000000',
      //   },
      //   fromBlock: _.toSafeInteger(process.env.REACT_APP_START_BLOCK),
      // });

      // for (let event of events) {
      //   // console.log(event.returnValues);
      //   token[event.returnValues.tokenId] = event.returnValues.to;
      // }

      for (let i = 1; i <= 10; i++) {
        try {
          const owner = await nftContract.ownerOf(i);
          // console.log({ owner });
          token[i] = owner;
        } catch (err) {
          // console.log({ i, err });
        }
      }

      let ownedToken;

      _.forEach(token, (address, tokenID) => {
        if (address === accounts[0]) {
          ownedToken = tokenID;
        }
      });

      let tokenList = _.map(token, (address, tokenID) =>
        _.toSafeInteger(tokenID),
      );

      // console.log({
      //   ownedToken,
      //   tokenList,
      // });

      if (!_.isNil(ownedToken)) {
        const data = await nftContract.tokenURI(ownedToken);

        const base64 = data.replace('data:application/json;base64,', '');

        const s = Buffer.from(base64, 'base64');
        // console.log({ s: s.toString() });

        const j = JSON.parse(s);
        // console.log({ j });

        const attributes = j.attributes;
        const background = attributes[0];

        setBgColor(background.value);
        setResult(j.image);
      }

      setIsOwner(owner === address);
      setMintAble(isWhitelisted);
      setNftContract(nftContract);
      setWeb3Provider(web3Provider);
      setSigner(signer);
      setWeb3(Web3);
      setProvider(provider);

      const n = _.filter(available, (i) => {
        return !_.includes(tokenList, i);
      });

      setAvailable(n);
      setMintAble(isWhitelisted && !!n.length);
      setFetching(false);
      // await getAccountAssets(chainId, address);
    } catch (e) {
      setFetching(false);
      setErr(e?.data ?? e);
    }
  };

  const subscribeProvider = async (provider, W3) => {
    if (!provider.on) {
      return;
    }
    provider.on('close', () => resetApp());
    provider.on('accountsChanged', async (accounts) => {
      setAddress(accounts[0]);
      // await getAccountAssets(null, accounts[0]);
    });
    provider.on('chainChanged', async (chainId) => {
      const networkId = await W3.eth.net.getId();

      setChainId(parseInt(networkId, 10));
      setNetworkId(parseInt(networkId, 10));
      // await getAccountAssets(chainId);
    });

    provider.on('networkChanged', async (networkId) => {
      // const chainId = await W3.eth.chainId();

      setChainId(parseInt(networkId, 10));
      setNetworkId(parseInt(networkId, 10));

      // await getAccountAssets(chainId);
    });
  };

  const resetApp = async () => {
    try {
      if (web3 && web3.currentProvider && web3.currentProvider.close) {
        await web3.currentProvider.close();
      }
      setFetching(false);
      setAddress('');
      setWeb3(null);
      setProvider(null);
      setConnected(false);
      setChainId(parseInt(process.env.REACT_APP_CHAIN_ID));
      setNetworkId(parseInt(process.env.REACT_APP_CHAIN_ID));
      setAssets([]);
      setShowModal(false);
      setPendingRequest(false);
      setResult(null);
      setBgColor(null);
      setIsOwner(false);
      setNewOwnerTarget('');
      setWhitelistTarget('');
      await web3Modal.current.clearCachedProvider();
    } catch (e) {
      setErr(e?.data ?? e);
    }
  };

  const onClaim = async () => {
    let res;
    try {
      // toggle pending request indicator
      setFetching(true);

      // if (!mintAble) {
      //   res = await nftContract.add(
      //     address,
      //     // '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      //   );
      //   console.log({ res });

      //   setMintAble(true);
      //   setFetching(false);
      //   return;
      // }

      // // const data = await nftContract.balanceOf(accounts[0]);\
      const tokenID = available[Math.floor(Math.random() * available.length)];
      // const tokenID = getRandomArbitrary(1, 10);
      // const tokenID = 6;
      console.log({ available, tokenID });

      res = await nftContract.claim(tokenID);
      console.log({ res });
      const data = await nftContract.tokenURI(tokenID);

      const base64 = data.replace('data:application/json;base64,', '');

      const s = Buffer.from(base64, 'base64');
      // console.log({ s: s.toString() });

      const j = JSON.parse(s);
      // console.log({ j });

      const attributes = j.attributes;
      const background = attributes[0];

      setBgColor(background.value);
      setResult(j.image);

      const n = _.filter(available, (i) => i !== tokenID);

      setAvailable(n);
      setFetching(false);
    } catch (e) {
      setFetching(false);
      console.error({ e });
      // if (e.code === -32603) {
      //   setErr({ code: -32603, message: 'only whitelisted' });
      //   return;
      // }
      setErr(e?.data ?? e);
    }
  };

  React.useEffect(() => {
    if (web3Modal.current.cachedProvider) {
      onConnect();
    }
  }, []);

  React.useEffect(() => {
    if (!result) {
      intvl.current = setInterval(() => {
        setCassetteStyle({
          bg: colors[Math.floor(Math.random() * colors.length)],
          head: colors[Math.floor(Math.random() * colors.length)],
          strip1: colors[Math.floor(Math.random() * colors.length)],
          strip2: colors[Math.floor(Math.random() * colors.length)],
          label: colors[Math.floor(Math.random() * colors.length)],
          body: colors[Math.floor(Math.random() * colors.length)],
        });
      }, 1000);
    } else {
      clearInterval(intvl.current);

      setCassetteStyle({
        ...cassetteStyle,
        bg: bgColor,
      });
    }
  }, [result]);

  // console.log({ connected });

  const addWhitelist = async () => {
    if (!whitelistTarget) return;

    try {
      setFetching(true);
      const res = await nftContract.add(whitelistTarget);
      console.log({ res });

      setFetching(false);
      return;
    } catch (e) {
      setFetching(false);
      console.error({ e });
      // if (e.code === -32603) {
      //   setErr({ code: -32603, message: 'only whitelisted' });
      //   return;
      // }
      setErr(e?.data ?? e);
    }
  };

  const transferOwner = async () => {
    if (!newOwnerTarget) return;

    try {
      setFetching(true);
      const res = await nftContract.transferOwnership(newOwnerTarget);
      console.log({ res });

      setFetching(false);
      resetApp();
      return;
    } catch (e) {
      setFetching(false);
      console.error({ e });
      // if (e.code === -32603) {
      //   setErr({ code: -32603, message: 'only whitelisted' });
      //   return;
      // }
      setErr(e?.data ?? e);
    }
  };

  return isOwner && chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? (
    <SLayout>
      <Column
        maxWidth={1000}
        style={{ height: '100vh', overflow: 'hidden' }}
        spanHeight
      >
        <Header
          connected={connected}
          address={address}
          chainId={chainId}
          killSession={resetApp}
          onClaim={onClaim}
          claimAble={!result && mintAble}
          contractAddress={nftContract?.address ?? ''}
          // owned={!!bgColor}
        />
        <SContent>
          <SBalances>
            <h3></h3>
            <Column center>
              <STestButtonContainer>
                <input
                  placeholder="Whitelist Address"
                  className="mt-2 border rounded p-4"
                  onChange={(e) => setWhitelistTarget(e.target.value)}
                  value={whitelistTarget}
                />
                <STestButton left onClick={addWhitelist}>
                  Add Whitelist
                </STestButton>
              </STestButtonContainer>
              <STestButtonContainer>
                <input
                  placeholder="New Owner Address"
                  className="mt-2 border rounded p-4"
                  onChange={(e) => setNewOwnerTarget(e.target.value)}
                  value={newOwnerTarget}
                />
                <STestButton left onClick={transferOwner}>
                  Change Owner
                </STestButton>
              </STestButtonContainer>
              <STestButtonContainer>
                <STestButton
                  left
                  onClick={() => {
                    setIsOwner(false);
                    setNewOwnerTarget('');
                    setWhitelistTarget('');
                  }}
                >
                  View NFT
                </STestButton>
              </STestButtonContainer>
            </Column>
            <h3></h3>
          </SBalances>
        </SContent>
      </Column>
      <Modal show={!!err} toggleModal={() => setErr(null)}>
        <SModalContainer>
          <SModalTitle>{err?.code}</SModalTitle>
          <SContainer>
            <Loader />
            <SModalParagraph>{err?.message}</SModalParagraph>
          </SContainer>
        </SModalContainer>
      </Modal>
      <Modal show={fetching}>
        <SModalContainer>
          <SContainer>
            <Loader />
          </SContainer>
        </SModalContainer>
      </Modal>
    </SLayout>
  ) : (
    <SLayout
      backgroundImage={
        // chainId === parseInt(process.env.REACT_APP_CHAIN_ID)
        //   ? result
        //     ? result
        //     : toffysoft // cassette
        //   : undefined
        result
      }
      backgroundColor={cassetteStyle?.bg}
    >
      {chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? (
        <>
          <Column
            maxWidth={1000}
            style={{ height: '100vh', overflow: 'hidden' }}
            spanHeight
          >
            {!result && (
              <Cassette style={{ position: 'absolute' }} {...cassetteStyle} />
            )}
            <Header
              connected={connected}
              address={address}
              chainId={chainId}
              killSession={resetApp}
              onClaim={onClaim}
              claimAble={!result && mintAble}
              owned={!!bgColor}
              contractAddress={nftContract?.address ?? ''}
            >
              {!connected ? (
                <>
                  {result ? null : typeof window.ethereum !== 'undefined' ||
                    typeof window.web3 !== 'undefined' ? (
                    <ConnectButton onClick={onConnect} />
                  ) : (
                    <h5
                      style={{ color: '#fff' }}
                    >{`Web3 Provider Not Found.`}</h5>
                  )}
                </>
              ) : (
                <>
                  {/* {result ? null : mintAble ? (
                    <ConnectButton title="Claim" onClick={onClaim} />
                  ) : (
                    <ConnectButton title="Whitelist" onClick={onClaim} />
                  )} */}
                  {/* <ConnectButton title="Whitelist" onClick={onClaim} /> */}
                </>
              )}
            </Header>
            {/* <SContent>
              {!connected ? (
                <SLanding center>
                  {result ? null : typeof window.ethereum !== 'undefined' ||
                    typeof window.web3 !== 'undefined' ? (
                    <ConnectButton onClick={onConnect} />
                  ) : (
                    <h3>{`Web3 Provider Not Found.`}</h3>
                  )}
                </SLanding>
              ) : (
                <SLanding center>
                  {result ? null : mintAble ? (
                    <ConnectButton title="Claim" onClick={onClaim} />
                  ) : (
                    <ConnectButton title="Whitelist" onClick={onClaim} />
                  )}
                </SLanding>
              )}
            </SContent> */}
          </Column>
          <Modal show={!!err} toggleModal={() => setErr(null)}>
            <SModalContainer>
              <SModalTitle>{err?.code}</SModalTitle>
              <SContainer>
                <Loader />
                <SModalParagraph>{err?.message}</SModalParagraph>
              </SContainer>
            </SModalContainer>
          </Modal>
          <Modal show={fetching}>
            <SModalContainer>
              <SContainer>
                <Loader />
              </SContainer>
            </SModalContainer>
          </Modal>
        </>
      ) : (
        <>
          <Column
            maxWidth={1000}
            style={{ height: '100vh', overflow: 'hidden' }}
            spanHeight
          >
            <Cassette style={{ position: 'absolute' }} {...cassetteStyle} />
            <Header
              connected={connected}
              address={address}
              chainId={chainId}
              killSession={resetApp}
              onClaim={onClaim}
              claimAble={!result && mintAble}
              owned={!!bgColor}
              contractAddress={nftContract?.address ?? ''}
            />
          </Column>
          <Modal
            show={chainId !== parseInt(process.env.REACT_APP_CHAIN_ID)}
            toggleModal={() => {
              // setChainId(parseInt(process.env.REACT_APP_CHAIN_ID));
              resetApp();
            }}
          >
            <SModalContainer>
              <SModalTitle>{`Invalid Chain ID. (${chainId})`}</SModalTitle>
            </SModalContainer>
          </Modal>
        </>
      )}
    </SLayout>
  );
}

export default App;
