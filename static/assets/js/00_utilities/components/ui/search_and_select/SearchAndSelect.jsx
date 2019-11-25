import React, {Fragment, memo, useEffect, useState} from 'react';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core";
import classNames from "classnames";

const useStyles = makeStyles(theme => (
    {
        item: {
            border: `1px solid ${theme.palette.primary.dark}`,
            borderRadius: '10px',
            padding: '5px',
            margin: 0
        },
        item_seleccionado: {
            border: `1px solid ${theme.palette.primary.dark}`,
            padding: '5px',
            margin: 0
        },
    })
);


const ItemSeleccion = memo(props => {
    const classes = useStyles();
    const [seleccionado, setSeleccionado] = useState(false);
    const {onSelect, select_boton_text = 'Seleccionar', selected_item_text, item_id, style_items} = props;
    const classNameItem = style_items === 'div' ? 'col-6 col-sm-4 col-md-3 text-center' : 'col-12';
    return (
        <div className={classNames(classNameItem, style_items === 'div' ? 'p-2' : '')}>
            <div className={classNames(classes.item, seleccionado ? classes.item_seleccionado : null)}>
                <span className='puntero'
                      onClick={() => setSeleccionado(!seleccionado)}
                >
                    {selected_item_text}
                </span>
                {
                    seleccionado &&
                    <Fragment>
                        <div style={{color: 'orange'}}>
                            <div>
                                <Button
                                    className='mb-2'
                                    color="primary"
                                    variant="contained"
                                    onClick={() => onSelect(item_id)}
                                >
                                    {select_boton_text}
                                </Button>

                            </div>
                        </div>
                    </Fragment>
                }
            </div>
        </div>
    )
});

const DialogSeleccionar = memo(props => {
    const {
        open,
        id_text = 'id',
        min_caracteres = 5,
        onSelect,
        fullWidth = false,
        maxWidth = 'sm',
        onSearch = null,
        placeholder = 'Colocar Place Holder',
        onCancelar = null,
        selected_item_text = 'nombre',
        select_boton_text,
        titulo_modal = 'Colocar título a modal',
        onUnMount = null,
        onMount = null,
        excluded_id = null,
        style_items = 'div'
    } = props;
    let {listado = []} = props;
    if (excluded_id) {
        listado = listado.filter(e => !excluded_id.includes(e[id_text]));
    }
    console.log(excluded_id)
    useEffect(() => {
        if (onMount) {
            onMount()
        }
        return () => {
            if (onUnMount) {
                onUnMount();
            }
        }
    }, []);
    const [campo_busqueda, setCampoBusqueda] = useState('');
    const buscarElemento = (busqueda) => {
        onSearch(busqueda);
    };
    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
        >
            <DialogTitle id="responsive-dialog-title">
                {titulo_modal}
            </DialogTitle>
            <DialogContent>
                <div className="row">
                    {onSearch && <TextField
                        id="text-field-controlled"
                        placeholder={placeholder}
                        value={campo_busqueda}
                        onChange={(v) => setCampoBusqueda(v.target.value)}
                    />}
                    {campo_busqueda.length > min_caracteres &&
                    onSearch && <Button
                        color="primary"
                        variant="contained"
                        onClick={() => buscarElemento(campo_busqueda)}
                        className='ml-3'
                    >
                        Buscar
                    </Button>}
                    {listado &&
                    (campo_busqueda.length > min_caracteres ||
                        min_caracteres === 0
                    ) &&
                    <Fragment>
                        {listado.map(e => {
                            return (
                                <ItemSeleccion
                                    style_items={style_items}
                                    key={e[id_text]}
                                    item_id={e[id_text]}
                                    onSelect={onSelect}
                                    selected_item_text={e[selected_item_text]}
                                    select_boton_text={select_boton_text}
                                />
                            )
                        })}
                    </Fragment>}
                </div>
            </DialogContent>
            <DialogActions>
                {onCancelar &&
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={onCancelar}
                >
                    Cancelar
                </Button>}
            </DialogActions>
        </Dialog>
    )

});

DialogSeleccionar.propTypes = {
    onMount: PropTypes.func,
    onSearch: PropTypes.func,
    onUnMount: PropTypes.func,
    onSelect: PropTypes.func,
    excluded_id: PropTypes.array,
    listado: PropTypes.array,
    onCancelar: PropTypes.func,
    open: PropTypes.bool,
    fullWidth: PropTypes.bool,
    style_items: PropTypes.string,
    id_text: PropTypes.string,
    titulo_modal: PropTypes.string,
    maxWidth: PropTypes.string,
    select_boton_text: PropTypes.string,
    selected_item_text: PropTypes.string,
    placeholder: PropTypes.string,
    min_caracteres: PropTypes.number,
    onDelete: PropTypes.func
};

export default DialogSeleccionar;