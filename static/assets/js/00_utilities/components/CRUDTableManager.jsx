import React, {Component} from 'react'
import ValidarPermisos from "../permisos/validar_permisos";
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';

class CRUDTableManager extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            item_seleccionado: null,
            modal_open: false,
            plural_name: null,
            singular_name: null,
        });
        this.onSelectItem = this.onSelectItem.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onCancel() {
        this.setState({modal_open: false});
    }

    componentDidMount() {
        const {
            plural_name,
            singular_name,
        } = this.props;
        this.setState({plural_name, singular_name});
    }

    handleModalClose() {
        this.setState({
            modal_open: false
        });
    }

    handleModalOpen() {
        this.setState({modal_open: true});
    }

    onSelectItem(item) {
        this.setState({item_seleccionado: item});
    }

    render() {
        const {permisos} = this.props;
        const {plural_name} = this.state;
        return (
            <ValidarPermisos can_see={permisos.list} nombre={plural_name}>
                {
                    permisos.add &&
                    <Button
                        color='primary'
                        className='ml-3'
                        onClick={() => {
                            this.setState({item_seleccionado: null});
                            this.handleModalOpen();
                        }}
                    >
                        Nuevo
                    </Button>
                }
                {this.props.children
                (
                    this.state,
                    (item) => this.onSelectItem(item),
                    () => this.onCancel(),
                    () => this.handleModalOpen(),
                    () => this.handleModalClose(),
                )
                }
            </ValidarPermisos>
        )
    }
}


CRUDTableManager.propTypes = {
    plural_name: PropTypes.string,
    singular_name: PropTypes.string,
    permisos: PropTypes.any
};

export default CRUDTableManager;