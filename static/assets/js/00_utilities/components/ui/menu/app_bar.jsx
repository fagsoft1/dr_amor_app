import React, {Fragment, Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import * as actions from "../../../../01_actions/01_index";
import {connect} from "react-redux";
import {withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Link} from 'react-router-dom';

class AppBarMenu extends Component {
    render() {
        const {classes, titulo} = this.props;
        return (
            <Fragment>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    className={classes.appBar}
                >
                    <Toolbar>
                        <Link to='/app/'>
                            <img src={`${img_static_url}/logo.png`} width="40"
                                 className="d-inline-block align-top mr-2"
                                 alt=""/>
                        </Link>
                        <Typography variant="h6" color="inherit" noWrap>
                            {titulo}
                        </Typography>
                        <div className='text-right' style={{position: 'absolute', right: 0}}>
                            <Button color="inherit" onClick={() => console.log('salio')}>Salir</Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    {this.props.children}
                </main>
            </Fragment>

        )
    }
}

const styles = theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
});

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
    }
}

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(AppBarMenu));