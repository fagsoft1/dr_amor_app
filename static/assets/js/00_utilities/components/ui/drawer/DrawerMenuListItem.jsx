import React, {memo} from 'react';
import {Link} from 'react-router-dom'
import {withStyles} from "@material-ui/core/styles/index";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
    main: {
        paddingLeft: theme.spacing(2),
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    iconColor: {
        color: theme.palette.primary.dark
    }
});

const DrawerListItem = memo(props => {
    const {link, texto, icono, classes, type = 'main', size = null} = props;
    console.log('3. renderizó list item menu')
    return (
        <Link to={link}>
            <ListItem button className={type === 'main' ? classes.main : classes.nested}>
                {
                    icono &&
                    <Tooltip title={texto}>
                        <ListItemIcon>
                            <FontAwesomeIcon className={classes.iconColor} icon={['far', icono]} size={size}/>
                        </ListItemIcon>
                    </Tooltip>
                }
                <ListItemText inset primary={texto}/>
            </ListItem>
        </Link>
    )
});

export default withStyles(styles, {withTheme: true})(DrawerListItem);