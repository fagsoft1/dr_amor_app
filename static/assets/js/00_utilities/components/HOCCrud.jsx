import React, {Fragment, useState, useRef} from 'react'
import {useDispatch} from 'react-redux';
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {notificarAction} from '../../01_actions';
import ExcelDownload from "../../00_utilities/components/system/ExcelDownload";
import CargarDatos from "./system/CargarDatos";

function crudHOC(CreateForm, Tabla) {
    const CRUD = props => {
        const dispatch = useDispatch();
        const {
            method_pool,
            posDeleteMethod,
            singular_name,
            posCreateMethod = null,
            posUpdateMethod = null,
            posSummitMethod = null,
            list,
            plural_name,
            permisos_object,
            con_titulo = true,
            cargarDatos = null
        } = props;
        const checkboxTable = useRef(null);
        const [item_seleccionado, setItemSeleccionado] = useState(null);
        const [modal_open, setModalOpen] = useState(false);
        const [selected_rows, setSelectedRows] = useState([]);
        const [are_select_all_rows, setSelectAllRows] = useState(false);


        const isRowTableSelected = key => selected_rows.includes(key);

        const toggleRowSelection = (key, shift, row) => {
            let new_selection = [...selected_rows];
            const keyIndex = new_selection.indexOf(key);

            if (keyIndex >= 0) {
                new_selection = [
                    ...new_selection.slice(0, keyIndex),
                    ...new_selection.slice(keyIndex + 1)
                ];
            } else {
                new_selection = [...new_selection, key];
            }
            setSelectedRows(new_selection);
            const wrappedInstance = checkboxTable.current.getWrappedInstance();
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            const selecciono_todos = _.size(currentRecords) === new_selection.length;
            setSelectAllRows(selecciono_todos);
        };

        const toggleAllRows = () => {
            let new_selection = [];
            if (!are_select_all_rows) {
                const wrappedInstance = checkboxTable.current.getWrappedInstance();
                const currentRecords = wrappedInstance.getResolvedState().sortedData;
                new_selection = currentRecords.map(item => item._original.id);
            }
            setSelectAllRows(!are_select_all_rows);
            setSelectedRows(new_selection);
        };

        const rowFn = (state, rowInfo, column, instance) => {
            return {
                onClick: (e, handleOriginal) => {
                    if (handleOriginal) {
                        handleOriginal();
                    }
                },
                style: {
                    background:
                        rowInfo &&
                        selected_rows.includes(rowInfo.original.id) &&
                        "lightblue"
                }
            };
        };

        const getTrGroupProps = (state, rowInfo) => {
            if (rowInfo !== undefined) {
                return {
                    key: rowInfo ? rowInfo.original.id : null
                }
            }
        };


        const onDelete = (item) => {
            if (method_pool.deleteObjectMethod === null) {
                console.log('No se ha asignado ningún método para DELETE')
            } else {
                const callback = () => {
                    const {to_string} = item;
                    const options = {
                        title: 'Eliminación Exitosa'
                    };
                    dispatch(notificarAction(`Se ha eliminado con éxito ${singular_name.toLowerCase()} ${to_string}`, options));
                    setModalOpen(false);
                    setItemSeleccionado(null);

                    if (posDeleteMethod) {
                        posDeleteMethod(item);
                    }
                };
                return method_pool.deleteObjectMethod(item.id, {callback});
            }
        };
        const setSelectItem = item_seleccionado => setItemSeleccionado(item_seleccionado);

        const onSelectForDelete = () => {
            if (method_pool.selectForDeleteObjectMethod) {
                console.log('lo hizo')
            }
        };


        const onSelectItemEdit = (item) => {
            const callback = (response) => {
                setModalOpen(true);
                setItemSeleccionado(response);
            };
            if (method_pool.fetchObjectMethod === null) {
                console.log('No se ha asignado ningún método para FETCH OBJECT')
            } else {
                return method_pool.fetchObjectMethod(item.id, {callback});
            }
        };


        const onSubmit = (item, uno = null, dos = null, cerrar_modal = true) => {
            const es_form_data = item instanceof FormData;
            const form_data_id = es_form_data ? item.get('id') : null;
            const callback = (response) => {
                const {to_string} = response;
                const options = {
                    title: item.id ? 'Actualizacion Exitosa' : 'Creación Exitosa'
                };
                dispatch(notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${singular_name.toLowerCase()} ${to_string}`, options));

                setModalOpen(!cerrar_modal);
                setItemSeleccionado(cerrar_modal ? null : response);

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

                    return method_pool.createObjectMethod(item, {callback});
                }
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
                            setModalOpen(true);
                            setItemSeleccionado(null);
                        }}
                    >
                        Nuevo
                    </Button>
                }
                {
                    selected_rows.length > 0 &&
                    <ExcelDownload
                        data={_.map(_.pickBy(list, l => selected_rows.includes(l.id)))}
                        name={plural_name ? plural_name : 'documento'}
                        file_name={plural_name ? plural_name : 'documento'}
                    />
                }
                {
                    modal_open &&
                    <CreateForm
                        {...props}
                        initialValues={item_seleccionado ? list[item_seleccionado.id] : null}
                        modal_open={modal_open}
                        onCancel={() => {
                            setItemSeleccionado(null);
                            setModalOpen(false);
                        }}
                        onSubmit={onSubmit}
                        setSelectItem={setSelectItem}
                    />
                }
                <div>
                    <Tabla
                        {...props}
                        getTrGroupProps={getTrGroupProps}
                        rowFn={rowFn}
                        isSelected={isRowTableSelected}
                        toggleSelection={toggleRowSelection}
                        toggleAll={toggleAllRows}
                        selection={selected_rows}
                        selectAll={are_select_all_rows}
                        checkboxTable={checkboxTable}
                        updateItem={onSubmit}
                        onDelete={onDelete}
                        onSelectForDelete={onSelectForDelete}
                        onSelectItemEdit={onSelectItemEdit}
                    />
                </div>
                {
                    cargarDatos && <CargarDatos
                        cargarDatos={cargarDatos}
                    />
                }
            </Fragment>
        )
    };

    return CRUD;
}


crudHOC.propTypes = {
    plural_name: PropTypes.string,
    singular_name: PropTypes.string,
    method_pool: PropTypes.any,
    permisos_object: PropTypes.any,
    list: PropTypes.any
};

export default crudHOC;
