import { Button, Tooltip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useLogin, usePrivy } from '@privy-io/react-auth';

interface WalletConnectButtonProps {
  onMenuAction?: () => void;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ onMenuAction }) => {
  const { ready, authenticated, user, logout } = usePrivy();
  const { login } = useLogin();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  if (!ready) return <></>;

  const walletAddress = user?.wallet?.address;

  if (authenticated && walletAddress) {
    return (
      <Tooltip title={walletAddress} arrow>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<AccountBalanceWalletIcon />}
          onClick={() => {
            logout();
            if (onMenuAction) onMenuAction();
          }}
          sx={{ minWidth: 0, px: 1.5, fontSize: 13 }}
        >
          {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      sx={{ minWidth: 0, px: 1.5, fontSize: 13 }}
      disabled={disableLogin}
      onClick={() => {
        login({
          loginMethods: ['wallet'],
          walletChainType: undefined,
          disableSignup: false
        });
        if (onMenuAction) onMenuAction();
      }}
    >
      Conectar billetera
    </Button>
  );
};

export default WalletConnectButton; 