import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl'; // Import tweetnacl for cryptographic functions
import { useState, useEffect } from 'react';

const HomePage = () => {
  const { publicKey, signMessage, connected } = useWallet();

  // State for signing messages
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState(null);
  const [formattedOutput, setFormattedOutput] = useState(null);

  // State for verifying pasted messages
  const [verifyInput, setVerifyInput] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState(null);

  // Track whether the component has mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure the component only renders on the client side
  }, []);

  const handleSignMessage = async () => {
    if (!signMessage) {
      alert('Wallet does not support signing messages!');
      return;
    }

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await signMessage(encodedMessage);
      const signatureBase64 = signedMessage.toString('base64');

      setSignature(signatureBase64);

      // Prepare formatted JSON for output
      setFormattedOutput({
        address: publicKey.toString(),
        msg: message,
        sig: signatureBase64,
      });
    } catch (error) {
      console.error('Signing failed:', error);
    }
  };

  const handleVerifyMessage = () => {
    const { address, msg, sig } = verifyInput;
    try {
      const key = new PublicKey(address); // Create PublicKey from address
      const encodedMessage = new TextEncoder().encode(msg); // Encode the message
      const publicKeyBytes = key.toBytes(); // Get public key bytes

      const isVerified = nacl.sign.detached.verify(
        encodedMessage, // The original message (encoded as bytes)
        Buffer.from(sig, 'base64'), // The signature (decoded from Base64)
        publicKeyBytes // The public key bytes
      );

      setVerifyStatus(isVerified ? 'Verified' : 'Verification Failed');
    } catch (error) {
      console.error('Verification failed:', error);
      setVerifyStatus('Verification Failed');
    }
  };

  if (!isMounted) {
    // Prevent rendering anything until the component is mounted on the client
    return null;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Solana Wallet Message Signer</h1>

      {/* Wallet Connection */}
      <WalletMultiButton />

      {/* Signing Section */}
      {connected ? (
        <div style={{ marginTop: '20px' }}>
          <h2>Sign Message</h2>
          <textarea
            placeholder="Write your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%',
              height: '100px',
              margin: '10px 0',
              fontSize: '16px',
              padding: '8px',
            }}
          />
          <button
            onClick={handleSignMessage}
            disabled={!message}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Sign Message
          </button>
          {formattedOutput && (
            <div>
              <p><strong>Copy this for verification:</strong></p>
              <textarea
                readOnly
                value={JSON.stringify(formattedOutput, null, 2)}
                style={{
                  width: '100%',
                  height: '150px',
                  fontSize: '14px',
                  padding: '8px',
                  whiteSpace: 'pre',
                  fontFamily: 'monospace',
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <p style={{ marginTop: '20px' }}>
          Please connect your wallet to sign messages.
        </p>
      )}

      {/* Verification Section */}
      <div style={{ marginTop: '40px' }}>
        <h2>Verify Message</h2>
        <p>To verify a message, please paste the details below.</p>
        <textarea
          placeholder={`Paste your JSON object here:\n{\n  "address": "wallet address here",\n  "msg": "message here",\n  "sig": "signature here"\n}`}
          onChange={(e) => {
            try {
              const input = JSON.parse(e.target.value); // Parse the pasted JSON
              setVerifyInput(input); // Update state if valid JSON
            } catch {
              setVerifyInput(null); // Clear state if invalid JSON
            }
          }}
          style={{
            width: '100%',
            height: '150px',
            margin: '10px 0',
            fontSize: '16px',
            padding: '8px',
            whiteSpace: 'pre',
            fontFamily: 'monospace',
          }}
        />
        <button
          onClick={handleVerifyMessage}
          disabled={!verifyInput} // Disable button if invalid JSON
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: verifyInput ? 'pointer' : 'not-allowed',
            marginTop: '10px',
          }}
        >
          Verify Message
        </button>
        {verifyStatus && (
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
            Verification Status: {verifyStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
