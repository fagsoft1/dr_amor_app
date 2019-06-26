import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.state = {
            hasError: false,
            error: null,
            info: null
        };
    }

    componentDidCatch(error, info) {
        this.setState({
            hasError: true,
            error: error,
            info: info
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <Dialog
                        open={this.state.hasError}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Oops!!! Algo ha fallado"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Tipo de error: {this.state.error.toString()}
                            </DialogContentText>
                            <details style={{whiteSpace: 'pre-wrap'}}>
                                {this.state.info.componentStack}
                            </details>
                        </DialogContent>
                        <DialogActions>
                            {/*<Button onClick={this.handleClose} color="primary">*/}
                            {/*Disagree*/}
                            {/*</Button>*/}
                            {/*<Button onClick={this.handleClose} color="primary" autoFocus>*/}
                            {/*Agree*/}
                            {/*</Button>*/}
                        </DialogActions>
                    </Dialog>
                </div>
            );
        } else {
            return this.props.children;
        }
    }
}

export default ErrorBoundary