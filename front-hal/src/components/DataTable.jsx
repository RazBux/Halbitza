import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';

const DataTable = ({ tableName, columnName, backendURL }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tableName) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                var query = `${backendURL}/data?tableName=${tableName}&columns=${columnName}`;
                console.log(`query: ${query}`);
                const response = await fetch(query);
                
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                // setData(result.data);
                setData(result || []);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tableName, columnName, backendURL]);

    const columns = React.useMemo(() => {
        if (data.length === 0) {
            return [];
        }
        const sampleItem = data[0];
        return Object.keys(sampleItem).map(key => ({
            Header: key.charAt(0).toUpperCase() + key.slice(1),
            accessor: key,
        }));
    }, [data]);

    const tableInstance = useTable({ columns, data });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error! {error.message}</div>;

    return (
        <div>
            <div>
                <br />
                <hr/>
                <h3>{tableName.toUpperCase()}:</h3>
            </div>
            <div className="table-container">
                <table {...getTableProps()} calssName="no-select">
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
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );   
    
};

export default DataTable;
