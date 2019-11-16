import React, {memo} from 'react';
import PropTypes from "prop-types";
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from "@material-ui/core/styles/index";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const IconButtonTableHistory = memo((props) => {
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
                    icon={['far', 'history']}
                    size='xs'
                />
            </IconButton>
        </div>
    )
});
IconButtonTableHistory.propTypes = {
    onClick: PropTypes.func
};
const styles = theme => (
    {
        icono: {
            color: theme.palette.primary.dark
        }
    })
;

export default withStyles(styles, {withTheme: true})(IconButtonTableHistory);