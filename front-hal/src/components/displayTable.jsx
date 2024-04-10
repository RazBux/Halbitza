import React from 'react';
import { useTable } from 'react-table';

const DataTable = ({ data, columns, onRowClick }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    return (