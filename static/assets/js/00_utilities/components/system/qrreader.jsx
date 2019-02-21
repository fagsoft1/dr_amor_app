import React, {Component, Fragment} from "react";
import QrReader from "react-qr-reader";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class QrReaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 300,
            result: "No result",
            open_qr_reader: false
        };
        this.handleScan = this.handleScan.bind(this);
    }

    handleScan(data) {
        if (data) {
            this.setState({
                result: data,
                open_qr_reader: false
            });
        }
    }

    handleError(err) {
        console.error(err);
    }

    render() {
        const {open_qr_reader} = this.state;
        return (
            <div>
                <div className='mt-5'>
                    <FontAwesomeIcon
                        icon={['far', 'qrcode']}
                        size='2x'
                        onClick={() => this.setState(s => ({open_qr_reader: !s.open_qr_reader}))}
                    />
                </div>
                {
                    open_qr_reader &&
                    <Fragment>
                        <QrReader
                            delay={this.state.delay}
                            onError={this.handleError}
                            onScan={this.handleScan}
                            style={{width: "250px"}}
                        />
                        <p>{this.state.result}</p>
                    </Fragment>
                }
            </div>
        );
    }
}

export default QrReaderComponent;
