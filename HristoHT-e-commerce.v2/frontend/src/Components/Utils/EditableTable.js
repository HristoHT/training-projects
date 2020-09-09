import React from 'react';
import MaterialTable, { MTableToolbar, MTableBody } from 'material-table';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

//const specialCSS = "<style>.MuiTableCell-root.MuiTableCell-body.MuiTableCell-alignLeft { padding: 0 !important } .MuiTableCell-root.MuiTableCell-body.MuiTableCell-paddingNone .MuiIconButton-root { padding: 0 !important }</style>"

const useStyles = makeStyles((theme) => ({
    ToolbarRoot: {
        maxHeight: '1vh!important',
        height: '6vh!important',
        minHeight: '6vh!important',
        backgroundColor: '#e8eaf5',
    },
    BodyRoot: {
        height: '15vh!important',
        backgroundColor: '#e8eaf5',

    }
}));

export default function MaterialTableDemo({ id, title, columns, data, setData, ...props }) {
    const styles = useStyles();

    const rowAdd = (newData, id) => {
        // newData.id = data.length;
        setData([...data, { ...newData, tableData: { id: data.length } }]);
    }
    const rowUpdate = (newData, oldData, id) => {
        let arr = [...data];
        const index = arr.indexOf(oldData);
        const updatedRow = { ...oldData, ...newData };
        arr.splice(index, 1, updatedRow);
        setData([...arr]);
    }
    const rowDelete = (oldData, id) => {
        const index = data.indexOf(oldData);
        let arr = [...data];
        arr.splice(index, 1);
        setData([...arr]);
    }

    return (
        <>
            {/* <div dangerouslySetInnerHTML={{ __html: specialCSS }}></div> */}
            <MaterialTable
                title={title}
                columns={columns}
                data={data}
                options={{
                    // maxBodyHeight: '30vh',
                    search: false,
                    padding: 'dense',
                }}

                localization={{
                    body: {
                        editRow: {
                            cancelTooltip: 'Затвори',
                            saveTooltip: 'Запази',
                            deleteText: (<Typography variant="subtitle1">Сигурни ли сте, че искате да изтриете този ред</Typography>)
                        },
                        emptyDataSourceMessage: 'Няма записани данни',
                        addTooltip: 'Добави',
                        deleteTooltip: 'Изтрий',
                        editTooltip: 'Промени',
                    },
                    header: {
                        actions: ''
                    },
                    pagination: {
                        labelDisplayedRows: '{from}-{to} от {count}',
                        labelRowsSelect: 'реда',
                        firstTooltip: 'Начало',
                        previousTooltip: 'Предишна',
                        nextTooltip: 'Слдеваща',
                        lastTooltip: 'Последна',
                    },
                }}

                pagination={{
                    labelRowsPerPage: '5'
                }}

                components={{
                    Container: props => <Paper {...props} elevation={0} />,
                    SearchBar: props => <div />,
                    Toolbar: props => (
                        <MTableToolbar classes={{ root: styles.ToolbarRoot }} {...props} />
                    ),
                    Body: props => (
                        <MTableBody {...props} />
                    )
                }}
                editable={{
                    onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                rowAdd(newData, id);
                            }, 100);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                rowUpdate(newData, oldData, id);
                            }, 100);
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                rowDelete(oldData, id);
                            }, 100);
                        }),
                }}
            />
        </>
    );
}