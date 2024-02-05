"use client"

import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { drawerWidth } from '@/utils/constants';
import { Box, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginWithButton from './LoginWithButton';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (open) => (open !== 'open'),
})<AppBarProps>(({ theme, open, }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

interface TopBarProps {
    open: boolean,
    buttonOnClick: any,
}

export default function TopBar({ open, buttonOnClick }: TopBarProps) {
    return (
        <AppBar position="fixed" open={open}>
            <Toolbar sx={{
                display: 'flex',
                justifyContent: open ? 'flex-end' : 'space-between',
            }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={buttonOnClick}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Box sx={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                    <Typography variant="h6" noWrap component="div">
                        BMS
                    </Typography>
                    <LoginWithButton provider='google' text='Log in' imageSrc='/google.svg' callbackUrl='https://bms-kesler.vercel.app/'></LoginWithButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}