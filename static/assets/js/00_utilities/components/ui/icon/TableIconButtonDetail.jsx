import React, {memo} from 'react';
import PropTypes from "prop-types";
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from "@material-ui/core/styles/index";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const IconButtonTableSee = memo((props) => {
    const {onClick = null, classes} = props;
    return (
        <div className='text-center'>
            <IconButton
                style={{
                    margin: 0,
                    padding: 4,
                }}
                onClick={() => {
                    if (onClick) {
                        onClick()
                    }
                }}
            >
                <FontAwesomeIcon
                    className={classes.icono}
                    icon={['far', 'eye']}
                    size='xs'
                />
            </IconButton>
        </div>
    )
});

IconButtonTableSee.propTypes = {
    onClick: PropTypes.func
};
const styles = theme => (
    {
        icono: {
            color: theme.palette.primary.dark
        }
    })
;


export default withStyles(styles, {withTheme: true})(IconButtonTableSee);