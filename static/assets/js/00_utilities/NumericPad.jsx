import React, {useState, useEffect, memo} from 'react';
import TextField from '@material-ui/core/TextField';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const NumericPad = memo((props) => {
    const [numeros, setNumeros] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const {pin, setPin, errores} = props;

    useEffect(() => {
        setNumeros(shuffle());
    }, []);

    const onNumberButtonClick = (event) => {
        event.preventDefault();
        const numero = event.target.value;
        setPin(pin.concat(numero));
        if (pin.length < 4) {
            setNumeros(shuffle());
        }

    };

    const renderPad = (numero) => {
        const disabled = pin.length >= 4;
        return (
            <div className="col-4 btn-group" role="group" key={numero}>
                <button
                    disabled={disabled}
                    className="btn btn-red"
                    onClick={onNumberButtonClick}
                    value={numero}>{numero}
                </button>
            </div>
        )
    };

    const shuffle = () => {
        let currentIndex = numeros.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = numeros[currentIndex];
            numeros[currentIndex] = numeros[randomIndex];
            numeros[randomIndex] = temporaryValue;
        }
        return numeros;
    };

    const renderErrores = () => {
        if (errores) {
            return (
                errores.map(error => {
                    return (<div key={error}>{error}</div>)
                })
            )
        }
    };
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
                        <a onClick={() => setPin('')}>
                            <FontAwesomeIcon
                                className='puntero'
                                icon={['far', 'eraser']}
                                size='3x'
                            />
                        </a>
                    </div>
                }
                <div className="col-12">
                    {renderErrores()}
                </div>
            </div>
            <div className="row">
                {numeros.map(numero => renderPad(numero))}
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
});

export default NumericPad;