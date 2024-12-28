import WalletConnectionProvider from '../components/WalletProvider';

const MyApp = ({ Component, pageProps }) => (
  <WalletConnectionProvider>
    <Component {...pageProps} />
  </WalletConnectionProvider>
);

export default MyApp;
