import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useMemo } from 'react';

// Default CSS for Wallet Modal
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletConnectionProvider = ({ children }) => {
  if (typeof window === 'undefined') {
    // Prevent rendering during SSR
    return null;
  }

  const network = WalletAdapterNetwork.Mainnet; // Use 'Devnet' for testing

  // List of wallets you want to support
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={`https://api.mainnet-beta.solana.com`}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectionProvider;
