import React, {Fragment, Component} from 'react';
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
import * as actions from "../../../../01_actions/01_index";
import {connect} from "react-redux";
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';


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
        width: theme.spacing.unit * 6 + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 7 + 1,
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
        padding: theme.spacing.unit * 3,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class DrawerMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawer_open: false
        }
    }

    onSalir() {
        const {auth: {punto_venta}} = this.props;
        const callback = () => {
            this.props.logout();
        };
        if (punto_venta && punto_venta.id) {
            this.props.updatePuntoVenta(
                punto_venta.id, {
                    ...punto_venta,
                    usuario_actual: null,
                    abierto: false
                },
                {callback}
            )
        }
        else {
            this.props.logout();
        }
    }

    handleDrawerOpen = () => {
        this.setState({drawer_open: true});
    };

    handleDrawerClose = () => {
        this.setState({drawer_open: false});
    };

    render() {
        const {classes, theme, lista_menu, titulo = 'Colocar Titulo'} = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: this.state.drawer_open,
                    })}
                >
                    <Toolbar disableGutters={!this.state.drawer_open}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, {
                                [classes.hide]: this.state.drawer_open,
                            })}
                        >
                            <FontAwesomeIcon icon={['fas', 'bars']}/>
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            {titulo}
                        </Typography>
                        <div className='text-right' style={{position: 'absolute', right: 0}}>
                            <Button color="inherit" onClick={() => this.onSalir()}>Salir</Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={classNames(classes.drawer, {
                        [classes.drawerOpen]: this.state.drawer_open,
                        [classes.drawerClose]: !this.state.drawer_open,
                    })}
                    classes={{
                        paper: classNames({
                            [classes.drawerOpen]: this.state.drawer_open,
                            [classes.drawerClose]: !this.state.drawer_open,
                        }),
                    }}
                    open={this.state.drawer_open}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {theme.direction === 'rtl' ?
                                <FontAwesomeIcon icon={['fas', 'angle-right']}/> :
                                <FontAwesomeIcon icon={['fas', 'angle-left']}/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        {lista_menu}
                        <Link to='/app/'>
                            <ListItem>
                                <img src={`${img_static_url}/logo.png`} width="40"
                                     className="d-inline-block align-top mr-2"
                                     alt=""/>
                            </ListItem>
                        </Link>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    {this.props.children}
                </main>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
    }
}

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(DrawerMenu));