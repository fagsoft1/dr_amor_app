import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {withStyles} from "@material-ui/core/styles/index";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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

class DrawerListItem extends Component {
    render() {
        const {link, texto, icono, classes, type = 'main', theme, size = null} = this.props;
        return (
            <Link to={link}>
                <ListItem button className={type === 'main' ? classes.main : classes.nested}>
                    <Tooltip title={texto}>
                        <ListItemIcon>
                            <FontAwesomeIcon icon={['fas', icono]} size={size}/>
                        </ListItemIcon>
                    </Tooltip>
                    <ListItemText inset primary={texto}/>
                </ListItem>
            </Link>
        )
    }
}

export default withStyles(styles, {withTheme: true})(DrawerListItem);