import * as React from 'react';
import styled from 'styled-components';
import * as PropTypes from 'prop-types';
import Blockie from './Blockie';
import Banner from './Banner';
import { ellipseAddress, getChainData } from '../helpers/utilities';
import { transitions } from '../styles';

const SHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const SActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`;

const SActiveChain = styled(SActiveAccount)`
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  & p {
    font-size: 0.8em;
    margin: 0;
    padding: 0;
  }
  & p:nth-child(2) {
    font-weight: bold;
  }
`;

const SBlockie = styled(Blockie)`
  margin-right: 10px;
`;

const SAddress = styled.p`
  transition: ${transitions.base};
  font-weight: bold;
  margin: ${({ connected }) => (connected ? '-2px auto 0.7em' : '0')};
`;

const SDisconnect = styled.div`
  transition: ${transitions.button};
  font-size: 12px;
  font-family: monospace;
  position: absolute;
  right: 0;
  top: 20px;
  opacity: 0.7;
  cursor: pointer;

  opacity: ${({ connected }) => (connected ? 1 : 0)};
  visibility: ${({ connected }) => (connected ? 'visible' : 'hidden')};
  pointer-events: ${({ connected }) => (connected ? 'auto' : 'none')};

  &:hover {
    transform: translateY(-1px);
    opacity: 0.5;
  }
`;

const Header = (props) => {
  const {
    connected,
    address,
    chainId,
    killSession,
    onClaim,
    claimAble,
    owned,
    contractAddress,
  } = props;
  const chainData = chainId ? getChainData(chainId) : null;

  return (
    <SHeader {...props}>
      {connected && chainData ? (
        <SActiveChain>
          <p style={{ color: owned ? '#000' : '#000' }}>{`Connected to`}</p>
          <p style={{ color: owned ? '#000' : '#000' }}>{chainData.name}</p>
          <p style={{ color: owned ? '#000' : '#000' }}>{contractAddress}</p>
        </SActiveChain>
      ) : (
        <Banner />
      )}
      {props.children}
      {address && connected && (
        <SActiveAccount>
          <SBlockie
            style={{ color: owned ? '#000' : '#000' }}
            address={address}
          />
          <SAddress
            style={{ color: owned ? '#000' : '#000' }}
            connected={connected}
          >
            {ellipseAddress(address)}
          </SAddress>
          {claimAble && (
            <SDisconnect
              style={{ color: owned ? '#000' : '#000', right: '100px' }}
              connected={connected}
              onClick={onClaim}
            >
              {'Claim'}
            </SDisconnect>
          )}
          <SDisconnect
            style={{ color: owned ? '#000' : '#000' }}
            connected={connected}
            onClick={killSession}
          >
            {'Disconnect'}
          </SDisconnect>
        </SActiveAccount>
      )}
    </SHeader>
  );
};

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string,
};

export default Header;
