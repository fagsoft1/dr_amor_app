import React, {Fragment} from "react";
import Checkbox from '@material-ui/core/Checkbox';
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../00_utilities/components/ui/icon/table_icon_button_detail';
import IconButtonTableEdit from '../../../00_utilities/components/ui/icon/table_icon_button_edit';
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = _.map(this.props.data);
        const {
            onSelectItemEdit
        } = this.props;

        if (_.size(data) <= 0) {
            return (
                <Fragment></Fragment>
            )
        }

        return (
            <ReactTable
                data={data}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Id",
                                accessor: "id",
                                maxWidth: 50
                            },
                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            // {
                            //     Header: "Activo",
                            //     accessor: "is_active",
                            //     show: permisos_object.make_user_active,
                            //     maxWidth: 60,
                            //     Cell: row => (
                            //         <Checkbox
                            //             checked={row.value}
                            //             onChange={() => updateItem({...row.original, is_active: !row.value})}
                            //         />
                            //     )
                            // },
                        ]
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;