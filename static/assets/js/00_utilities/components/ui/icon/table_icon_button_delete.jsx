import React from 'react';
import PropTypes from "prop-types";
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from "@material-ui/core/styles/index";

export const IconButtonTableDelete = (props) => {
    const {onClick, classes} = props;
    return (
        <div className='text-center'>
            <IconButton
                style={{
                    margin: 0,
                    padding: 4,
                }}
                onClick={onClick}
            >
                <FontAwesomeIcon
                    className={classes.icono}
                    icon={['fas', 'trash']}
                    size='xs'
                />
            </IconButton>
        </div>
    )
};
IconButtonTableDelete.propTypes = {
    onClick: PropTypes.func
};
const styles = theme => (
    {
        icono: {
            color: theme.palette.primary.dark
        }
    })
;


export default withStyles(styles, {withTheme: true})(IconButtonTableDelete);