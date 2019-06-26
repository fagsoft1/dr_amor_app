import React, {memo} from 'react';
import PropTypes from "prop-types";
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from "@material-ui/core/styles/index";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const IconButtonTableEdit = memo((props) => {
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
                    icon={['far', 'edit']}
                    size='xs'
                />
            </IconButton>
        </div>
    )
});
IconButtonTableEdit.propTypes = {
    onClick: PropTypes.func
};
const styles = theme => (
    {
        icono: {
            color: theme.palette.primary.dark
        }
    })
;

export default withStyles(styles, {withTheme: true})(IconButtonTableEdit);