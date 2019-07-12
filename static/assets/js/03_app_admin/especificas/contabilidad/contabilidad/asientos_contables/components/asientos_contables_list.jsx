import React, {Component, Fragment} from 'react';
import CreateForm from './forms/asiento_contable_form';
import Tabla from './AsientoContableTabla';
import crudHOC from '../../../../../../00_utilities/components/HOCCrudViejo';
import DatePicker from 'react-widgets/lib/DatePicker';
import Combobox from "react-widgets/lib/Combobox";


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fecha_seleccionada: null,
            empresa_id: null,
            diario_contable_id: null,
        };
        this.method_pool = {
            fetchObjectMethod: this.props.fetchAsientoContable,
            deleteObjectMethod: this.props.deleteAsientoContable,
            createObjectMethod: this.props.createAsientoContable,
            updateObjectMethod: this.props.updateAsientoContable,
        };
        this.plural_name = 'Asientos Contables';
        this.singular_name = 'Asiento Contable';
    }

    consultarAsientosContables() {
        const {fecha_seleccionada, diario_contable_id, empresa_id} = this.state;
        if (fecha_seleccionada && diario_contable_id && empresa_id) {
            this.props.fetchAsientosContables_por_fecha_empresa_diario(fecha_seleccionada.toLocaleDateString(), diario_contable_id, empresa_id);
        }
    }

    render() {
        const {
            object_list,
            permisos_object,
            empresas,
            diarios_contables,
        } = this.props;
        const {fecha_seleccionada, diario_contable_id, empresa_id} = this.state;
        const can_add = permisos_object.add && fecha_seleccionada !== null && diario_contable_id !== null && empresa_id !== null;
        return (
            <Fragment>
                <div className='row'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <Combobox
                            data={_.map(empresas, e => ({id: e.id, nombre: e.nombre}))}
                            filter='contains'
                            valueField='id'
                            value={empresa_id}
                            textField='nombre'
                            placeholder='Seleccione Empresa'
                            onSelect={(e) => this.setState({empresa_id: e.id}, () => this.consultarAsientosContables())}
                            onChange={(e) => this.setState({empresa_id: e.id})}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <DatePicker
                            placeholder='Seleccione Fecha'
                            onChange={(e, f) => this.setState({fecha_seleccionada: e}, () => this.consultarAsientosContables())}
                            time={false}
                            max={new Date()}
                            value={!fecha_seleccionada ? null : new Date(fecha_seleccionada)}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <Combobox
                            value={diario_contable_id}
                            placeholder='Seleccione Diario'
                            data={_.map(diarios_contables, e => ({id: e.id, nombre: e.nombre}))}
                            filter='contains'
                            valueField='id'
                            textField='nombre'
                            onChange={(e) => this.setState({diario_contable_id: e.id})}
                            onSelect={(e) => this.setState({diario_contable_id: e.id}, () => this.consultarAsientosContables())}
                        />
                    </div>
                </div>
                <CRUD
                    {...this.props}
                    diario={diarios_contables[diario_contable_id]}
                    empresa={empresas[empresa_id]}
                    fecha={fecha_seleccionada}
                    method_pool={this.method_pool}
                    list={object_list}
                    plural_name={this.plural_name}
                    singular_name={this.singular_name}
                    permisos_object={{...permisos_object, add: can_add}}
                />
            </Fragment>
        )
    }
}

export default List;