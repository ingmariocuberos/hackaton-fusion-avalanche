import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AccountCircle, Menu as MenuIcon, Book } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { usePrivy } from '@privy-io/react-auth';

const WalletConnectButton = () => {
  const { connectWallet, ready, authenticated, user, logout } = usePrivy();
  if (!ready) return null;

  const handleConnect = () => {
    connectWallet({
      walletList: ['metamask', 'detected_ethereum_wallets', 'coinbase_wallet', 'rainbow', 'wallet_connect'],
    });
  };

  return (
    <Box sx={{ ml: 2 }}>
      {authenticated ? (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{ minWidth: 0, px: 1.5, fontSize: 13 }}
          onClick={logout}
        >
          {user?.wallet?.address
            ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
            : user?.email?.address || 'Desconectar'}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ minWidth: 0, px: 1.5, fontSize: 13 }}
          onClick={handleConnect}
        >
          Conectar billetera
        </Button>
      )}
    </Box>
  );
};

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 0, color: 'inherit', minWidth: '150px' }}
        >
          {currentUser?.displayName || 'Mario Cuberos'}
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="end"
              aria-label="cuenta del usuario"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem 
                onClick={() => handleNavigate('/')}
                selected={isActive('/')}
              >
                Inicio
              </MenuItem>
              <MenuItem 
                onClick={() => handleNavigate('/contenido')}
                selected={isActive('/contenido')}
              >
                Contenido
              </MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              <MenuItem>
                <WalletConnectButton />
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, justifyContent: 'flex-end' }}>
            <Button
              color="inherit"
              onClick={() => handleNavigate('/')}
              sx={{
                backgroundColor: isActive('/') ? 'rgba(0, 0, 0, 0.08)' : 'transparent'
              }}
            >
              Inicio
            </Button>
            <Button
              color="inherit"
              startIcon={<Book />}
              onClick={() => handleNavigate('/contenido')}
              sx={{
                backgroundColor: isActive('/contenido') ? 'rgba(0, 0, 0, 0.08)' : 'transparent'
              }}
            >
              Contenido
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <AccountCircle />
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
            <WalletConnectButton />
          </Box>
        )}
        {!isMobile && <WalletConnectButton />}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 