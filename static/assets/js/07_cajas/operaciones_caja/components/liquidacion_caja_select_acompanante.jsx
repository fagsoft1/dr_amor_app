import React, {Component} from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import {FlatIconModal} from '../../../00_utilities/components/ui/icon/iconos_base';

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
                    <FlatIconModal
                        text='Consultar'
                        className='btn btn-primary'
                        //disabled={submitting || pristine}
                        type='submit'
                        onClick={() => onSubmit(this.state)}
                    />
                }

            </div>
        )
    }
}

export default HabitacionSelectModeloServicio;