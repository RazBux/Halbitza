import React from "react";
import { useTable } from "react-table";

const DisplayTable = React.memo(({ data, onRowSelect }) => {
    const columns = React.useMemo(() => {
        if (data.length === 0) {
            return [];
        }
        return Object.keys(data[0]).map(key => ({
            Header: key.charAt(0).toUpperCase() + key.slice(1),
            accessor: key,
        }));
    }, [data]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <div className="table-container">
            <table {...getTableProps()} className="no-select">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} onClick={() => onRowSelect(row.original)}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
});

export default DisplayTable;