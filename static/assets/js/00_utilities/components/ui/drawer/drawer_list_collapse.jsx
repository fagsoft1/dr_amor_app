import React, {Fragment, Component} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import {withStyles} from "@material-ui/core/styles/index";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
    main: {
        paddingLeft: theme.spacing.unit * 2,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class ListCollapse extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false}
    }

    render() {
        const {open} = this.state;
        const {icono, texto, children} = this.props;
        return (
            <Fragment>
                <ListItem button
                          onClick={() => this.setState(state => ({open: !state.open}))}>
                    <Tooltip title={texto}>
                        <ListItemIcon>
                            <FontAwesomeIcon icon={['fas', icono]} size='lg'/>
                        </ListItemIcon>
                    </Tooltip>
                    <ListItemText inset primary={texto}/>
                    {open ?
                        <FontAwesomeIcon icon={['fas', 'angle-up']}/> :
                        <FontAwesomeIcon icon={['fas', 'angle-down']}/>}
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

export default withStyles(styles, {withTheme: true})(ListCollapse);