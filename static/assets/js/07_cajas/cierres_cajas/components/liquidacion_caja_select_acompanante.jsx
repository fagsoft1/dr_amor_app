import React, {Component} from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import Button from '@material-ui/core/Button';

class HabitacionSelectModeloServicio extends Component {
    render() {
        const {
            acompanantes,
            onSubmit,
            setTercero,
            id_tercero
        } = this.props;
        return (
            <div className='row'>
                <DropdownList
                    data={_.map(_.pickBy(acompanantes, a => a.estado === 0), c => c)}
                    placeholder='Acompañante'
                    textField='full_name_proxy'
                    className="col-12 col-md-4"
                    valuesField='id'
                    onSelect={(e) => setTercero(e.id)}
                />
                {
                    id_tercero &&
                    <Button
                        color="primary"
                        variant="contained"
                        className='ml-3'
                        onClick={() => onSubmit(this.state)}
                    >
                        Consultar
                    </Button>
                }

            </div>
        )
    }
}

export default HabitacionSelectModeloServicio;