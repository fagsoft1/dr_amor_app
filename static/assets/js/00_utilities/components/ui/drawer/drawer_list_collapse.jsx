import React, {Fragment, Component} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import {withStyles} from "@material-ui/core/styles/index";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";

const styles = theme => ({
    main: {
        paddingLeft: theme.spacing.unit * 2,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    iconColor: {
        color: theme.palette.primary.dark
    }
});

class ListCollapse extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false}
    }

    render() {
        const {open} = this.state;
        const {icono, texto, children, classes} = this.props;
        return (
            <Fragment>
                <ListItem
                    button
                    onClick={() => {
                        this.setState(state => {
                                if (state.open) {
                                    this.props.closeTMenu();
                                } else {
                                    this.props.openTMenu();
                                }
                                return (
                                    {open: !state.open}
                                )
                            }
                        );
                    }}
                >
                    <Tooltip title={texto}>
                        <ListItemIcon>
                            <FontAwesomeIcon icon={['far', icono]} size='lg' className={classes.iconColor}/>
                        </ListItemIcon>
                    </Tooltip>
                    <ListItemText inset primary={texto}/>
                    {open ?
                        <FontAwesomeIcon icon={['far', 'angle-up']} className={classes.iconColor}/> :
                        <FontAwesomeIcon icon={['far', 'angle-down']} className={classes.iconColor}/>}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {children}
                    </List>
                </Collapse>
            </Fragment>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        menu_status: state.menu_status
    }
}

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(ListCollapse));