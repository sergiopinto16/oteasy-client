import {SelectColumnFilter} from "../../utils/filter";
import react from "react";


const table_spm = react.memo(
    () => [
        {
            Header: "ID",
            accessor: "_id",
            Cell: props => <a href={"spm/" + props.value}>{props.value}</a>
        },
        {
            Header: "Utente",
            accessor: "utente"
        },
        {
            Header: "Author",
            accessor: "author"
        },
        {
            Header: "evaluation_date",
            accessor: "evaluation_date"
        },
        {
            Header: "evaluation_reason",
            accessor: "evaluation_reason",
            disableFilters: true
        },
        {
            Header: "spm_type",
            accessor: "spm_type",
            filter: 'equals', // by default, filter: 'text', but in our case we don't want to filter options like text, we want to find exact match of selected option.
            Filter: SelectColumnFilter
        },
        {
            Header: "Doctor",
            accessor: "doctor",
            filter: 'equals', // by default, filter: 'text', but in our case we don't want to filter options like text, we want to find exact match of selected option.
            Filter: SelectColumnFilter

        },
        {
            Header: "Time",
            accessor: "createdAt",
            disableFilters: true

        },
    ],
    []
);

const table_session = react.memo(
    () => [
        {
            Header: "ID",
            accessor: "_id",
            Cell: props => <a href={"spm/" + props.value}>{props.value}</a>
        },
        {
            Header: "Utente",
            accessor: "utente"
        },
        {
            Header: "Author",
            accessor: "author"
        },
        {
            Header: "Title",
            accessor: "title"
        },
        {
            Header: "Summary",
            accessor: "summary"
        },
        {
            Header: "Time",
            accessor: "createdAt",
            disableFilters: true

        },
    ],
    []
);


export { table_spm, table_session };
