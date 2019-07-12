import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {notificarAction} from '../../01_actions';
import ExcelDownload from "../../00_utilities/components/system/ExcelDownload";
import CargarDatos from "./system/CargarDatos";

const style = {
    seleccionar_todo: {
        position: 'absolute',
        bottom: 0,
        right: 50,
        zIndex: 10000
    }
};

function crudHOC(CreateForm, Tabla) {
    class CRUD extends Component {
        constructor(props) {
            super(props);
            this.state = ({
                item_seleccionado: null,
                modal_open: false,
                data_to_excel: {}
            });
            this.onSubmit = this.onSubmit.bind(this);
            this.onDelete = this.onDelete.bind(this);
            this.onSelectItemEdit = this.onSelectItemEdit.bind(this);
            this.onSelectDataToExcel = this.onSelectDataToExcel.bind(this);
            this.setSelectItem = this.setSelectItem.bind(this);
        }

        onSelectDataToExcel(item) {
            let {data_to_excel} = this.state;
            if (data_to_excel[item.id]) {
                data_to_excel = _.omit(data_to_excel, item.id);
            } else {
                data_to_excel = {...data_to_excel, [item.id]: item}
            }
            this.setState({data_to_excel})
        }

        onDelete(item) {
            const {method_pool, notificarAction, singular_name, posDeleteMethod = null} = this.props;
            if (method_pool.deleteObjectMethod === null) {
                console.log('No se ha asignado ningún método para DELETE')
            } else {
                const callback = () => {
                    const {to_string} = item;
                    const options = {
                        title: 'Eliminación Exitosa'
                    };
                    notificarAction(`Se ha eliminado con éxito ${singular_name.toLowerCase()} ${to_string}`, options);
                    this.setState({modal_open: false, item_seleccionado: null});
                    if (posDeleteMethod) {
                        posDeleteMethod(item);
                    }
                };
                return method_pool.deleteObjectMethod(item.id, {callback});
            }
        }

        onSubmit(item, uno = null, dos = null, cerrar_modal = true, callback_error = null) {
            const es_form_data = item instanceof FormData;
            const form_data_id = es_form_data ? item.get('id') : null;
            const {
                method_pool,
                notificarAction,
                singular_name,
                posCreateMethod = null,
                posUpdateMethod = null,
                posSummitMethod = null
            } = this.props;
            const callback = (response) => {
                const {to_string} = response;
                const options = {
                    title: item.id ? 'Actualizacion Exitosa' : 'Creación Exitosa'
                };
                notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${singular_name.toLowerCase()} ${to_string}`, options);
                this.setState({modal_open: !cerrar_modal, item_seleccionado: cerrar_modal ? null : response});

                if (item.id && posUpdateMethod) {
                    posUpdateMethod(response);
                }
                if (!item.id && posCreateMethod) {
                    posCreateMethod(response);
                }
                if (posSummitMethod) {
                    posSummitMethod(response)
                }
            };
            if (item.id || (es_form_data && form_data_id)) {
                if (method_pool.updateObjectMethod === null) {
                    console.log('No se ha asignado ningún método para UPDATE')
                } else {
                    if (es_form_data) {
                        return method_pool.updateObjectMethod(form_data_id, item, {callback});
                    }
                    return method_pool.updateObjectMethod(item.id, item, {callback});
                }
            } else {
                if (method_pool.createObjectMethod === null) {
                    console.log('No se ha asignado ningún método para CREATE')
                } else {
                    return method_pool.createObjectMethod(item, {callback, callback_error});
                }
            }
        }

        onSelectItemEdit(item) {
            const {method_pool} = this.props;
            const callback = (res) => this.setState({modal_open: true, item_seleccionado: res});
            if (method_pool.fetchObjectMethod === null) {
                console.log('No se ha asignado ningún método para FETCH OBJECT')
            } else {
                return method_pool.fetchObjectMethod(item.id, {callback});
            }
        }

        setSelectItem(item_seleccionado) {
            this.setState({item_seleccionado})
        }

        componentDidMount() {
            const {plural_name, singular_name} = this.props;
            document.title = plural_name ? plural_name : (singular_name ? singular_name : 'Dr. Amor');
        }

        render() {
            const {
                list,
                plural_name,
                con_titulo = true,
                permisos_object,
                auth = null,
                singular_name,
                cargarDatos = null
            } = this.props;
            const {
                item_seleccionado,
                modal_open,
                data_to_excel,
            } = this.state;

            const onSeleccionarTodo = () => {
                if (_.size(data_to_excel) === _.size(list)) {
                    this.setState({data_to_excel: {}})
                } else {
                    this.setState({data_to_excel: list})
                }

            };

            if (!permisos_object.list) {
                return <Fragment>{`No tiene suficientes permisos para ver ${plural_name}.`}</Fragment>
            }

            return (
                <Fragment>
                    {
                        con_titulo &&
                        <Typography variant="h5" gutterBottom color="primary">
                            {plural_name}
                        </Typography>
                    }
                    {
                        permisos_object.add &&
                        <Button
                            color='primary'
                            className='ml-3'
                            onClick={() => {
                                this.setState({item_seleccionado: null, modal_open: true});
                            }}
                        >
                            Nuevo
                        </Button>

                    }
                    {
                        _.size(data_to_excel) > 0 &&
                        <ExcelDownload
                            data={_.map(data_to_excel)}
                            name={plural_name ? plural_name : 'documento'}
                            file_name={plural_name ? plural_name : 'documento'}
                        />
                    }
                    {
                        modal_open &&
                        <CreateForm
                            {...this.props}
                            initialValues={item_seleccionado ? list[item_seleccionado.id] : null}
                            modal_open={modal_open}
                            onCancel={() => this.setState({modal_open: false, item_seleccionado: null})}
                            onSubmit={this.onSubmit}
                            setSelectItem={this.setSelectItem}
                        />
                    }
                    <span
                        style={style.seleccionar_todo}
                        className='puntero'
                        onClick={onSeleccionarTodo}
                    >
                            {_.size(data_to_excel) === _.size(list) ? 'Quitar Selección' : 'Seleccionar Todo'}
                        </span>
                    <Tabla
                        {...this.props}
                        auth={auth}
                        permisos_object={permisos_object}
                        list={list}
                        singular_name={singular_name}
                        updateItem={this.onSubmit}
                        onDelete={this.onDelete}
                        onSelectItemEdit={this.onSelectItemEdit}
                        onSelectDataToExcel={this.onSelectDataToExcel}
                    />
                    {
                        cargarDatos &&
                        <CargarDatos
                            cargarDatos={cargarDatos}
                        />
                    }
                </Fragment>
            )
        }
    }

    return connect(null, {notificarAction})(CRUD);
}


crudHOC.propTypes = {
    plural_name: PropTypes.string,
    singular_name: PropTypes.string,
    method_pool: PropTypes.any,
    permisos_object: PropTypes.any,
    list: PropTypes.any
};

export default crudHOC;
