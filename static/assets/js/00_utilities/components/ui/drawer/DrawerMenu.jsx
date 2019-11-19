import React, {useEffect, memo} from 'react';
import Drawer from '@material-ui/core/Drawer';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions";
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

const drawerWidth = 240;
const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(6 + 1),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(7 + 1),
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    nested: {
        paddingLeft: theme.spacing(),
    },
    iconColor: {
        color: theme.palette.primary.dark
    },
    bigAvatar: {
        width: 75,
        height: 75,
        border: `3px solid ${theme.palette.primary.main}`
    },
});


const DrawerMenu = memo((props) => {
    const dispatch = useDispatch();
    const menu_status = useSelector(state => state.menu_status);
    const {open_menu, submenu_abiertos} = menu_status;
    const menu_abierto = submenu_abiertos > 0 || open_menu;
    const logo_icon_style = {position: 'relative', right: 10};
    const boton_salir_style = {position: 'absolute', right: 80};
    const configuracion_aplicacion = useSelector(state => state.configuracion_aplicacion);
    const {datos_generales} = configuracion_aplicacion;

    console.log('1. renderizó menu')
    const {
        classes,
        theme,
        lista_menu = null,
        titulo = 'Colocar Titulo',
        mi_cuenta,
        children
    } = props;
    useEffect(() => {
        console.log('entro a use effect del menu')
        return () => {
            dispatch(actions.resetMenu())
        }
    }, []);
    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: menu_abierto,
                })}
            >
                <Toolbar disableGutters={!menu_abierto}>
                    {
                        lista_menu &&
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={() => dispatch(actions.openMenu())}
                            className={classNames(classes.menuButton, {
                                [classes.hide]: menu_abierto,
                            })}
                        >
                            <FontAwesomeIcon icon={['far', 'bars']}/>
                        </IconButton>
                    }
                    <Typography className={lista_menu ? '' : 'pl-5'} variant="h6" color="inherit" noWrap>
                        {titulo}
                    </Typography>
                    {
                        mi_cuenta &&
                        mi_cuenta.imagen_perfil_url &&
                        <div style={{
                            position: 'absolute',
                            bottom: -10,
                            right: 0
                        }}>
                            <Grid container justify="center" alignItems="center">
                                <Avatar alt="Remy Sharp" src={mi_cuenta.imagen_perfil_url}
                                        className={classes.bigAvatar}/>
                            </Grid>
                        </div>
                    }

                    <div className='text-right' style={boton_salir_style}>
                        <Button
                            color="inherit"
                            onClick={() => dispatch(actions.logout())}
                        >
                            Salir
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={classNames(classes.drawer, {
                    [classes.drawerOpen]: menu_abierto,
                    [classes.drawerClose]: !menu_abierto,
                })}
                classes={{
                    paper: classNames({
                        [classes.drawerOpen]: menu_abierto,
                        [classes.drawerClose]: !menu_abierto,
                    }),
                }}
                open={menu_abierto}
            >
                <div className={classes.toolbar}>
                    {
                        lista_menu &&
                        <IconButton onClick={() => dispatch(actions.closeMenu())}>
                            {theme.direction === 'rtl' ?
                                <FontAwesomeIcon icon={['far', 'angle-right']} className={classes.iconColor}/> :
                                <FontAwesomeIcon icon={['far', 'angle-left']} className={classes.iconColor}/>}
                        </IconButton>
                    }
                </div>

                <Divider/>
                <List>
                    {lista_menu}
                    <Link to='/app/'>
                        <ListItem>
                            <img src={datos_generales.icon_small}
                                 className="d-inline-block align-top mr-2"
                                 alt=""
                                 style={logo_icon_style}
                            />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar}/>
                {children}
            </main>
        </div>
    )

});
export default withStyles(styles, {withTheme: true})(DrawerMenu);