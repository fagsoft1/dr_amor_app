import React, {Fragment, useState, memo} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import {withStyles} from "@material-ui/core/styles/index";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';
import {useDispatch} from 'react-redux';
import * as actions from '../../../../01_actions/01_index';

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

const ListCollapse = (props) => {
    const {icono, texto, children, classes} = props;
    const [open, setOpen] = useState(false);
    console.log('2. renderizó list menu')
    const dispatch = useDispatch();
    return (
        <Fragment>
            <ListItem
                button
                onClick={() => {
                    if (open) {
                        dispatch(actions.closeTMenu())
                    } else {
                        dispatch(actions.openTMenu())
                    }
                    return (
                        setOpen(!open)
                    )
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
};

export default withStyles(styles, {withTheme: true})(ListCollapse);