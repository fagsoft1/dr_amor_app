import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default class NumericPad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numeros: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        }
    }

    componentDidMount() {
        this.setState({numeros: this.shuffle()});
    }

    onNumberButtonClick(event) {
        event.preventDefault();
        const numero = event.target.value;
        this.props.setPin(numero);

        if (this.props.pin.length < 4) {
            this.setState({numeros: this.shuffle()});
        }

    }

    renderPad(numero) {
        const {pin} = this.props;
        const disabled = pin.length >= 4;
        return (
            <div className="col-4 btn-group" role="group" key={numero}>
                <button
                    disabled={disabled}
                    className="btn btn-red"
                    onClick={this.onNumberButtonClick.bind(this)}
                    value={numero}>{numero}
                </button>
            </div>
        )
    }

    shuffle() {
        let array = this.state.numeros;
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    renderErrores() {
        const {errores} = this.props;
        if (errores) {
            return (
                errores.map(error => {
                    return (<div key={error}>{error}</div>)
                })
            )
        }
    }

    render() {
        const {pin, resetPin} = this.props;
        const {numeros} = this.state;
        return (
            <div className="col-12 col-md-4 numeri-pad-react">
                <div className="row">
                    <div className="col-10">
                        <TextField
                            disabled={true}
                            name='pin'
                            className="col-12 col-md-4 readOnlyInput"
                            type='password'
                            value={pin}
                            placeholder="Su pin"
                        />
                    </div>
                    {
                        pin.length > 0 &&
                        <div className="col-1">
                            <a onClick={() => resetPin()}>
                                <FontAwesomeIcon
                                    className='puntero'
                                    icon={['far', 'eraser']}
                                    size='3x'
                                />
                            </a>
                        </div>
                    }
                    <div className="col-12">
                        {this.renderErrores()}
                    </div>
                </div>
                <div className="row">
                    {numeros.map(numero => this.renderPad(numero))}
                    {
                        pin.length === 4 &&
                        <div className="col-8 btn-group" role="group">
                            <button type="submit" className="btn btn-light-green">
                                <FontAwesomeIcon
                                    icon={['far', 'check']}
                                />
                            </button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}