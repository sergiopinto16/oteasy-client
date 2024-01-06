import GasReports from "./GasReports";
import {Link, Route, Routes} from 'react-router-dom';

import {useContext, useEffect, useState, useRef, useMemo} from "react";
import {UserContext} from "../../UserContext";

import { Container } from "reactstrap"
import "bootstrap/dist/css/bootstrap.min.css"

import TableContainer from "../../utils/TableContainer";
import { SelectColumnFilter } from '../../utils/filter';
import './IndexPage.css';

import config from './../../config/config.json';

const api_host = config.api.host
//' + api_host + ':' + api_port + '


// TODO - if not logged and not credentials redirect to home page or show message not credentials 

export default function IndexPage() {
    const {userInfo, setUserInfo} = useContext(UserContext);

    if (userInfo?.email === undefined) {
        console.log("Not logged, return to home")
        window.location.replace("/");
    }


    const [gasReports, setGasReports] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(api_host + '/api/gas/gasReports', {credentials: 'include'}).then(response => {
                response.json().then(gasReports => {
                    setGasReports(gasReports);
                });
            });
        };

        fetchData();

    }, []);

    const columns = useMemo(
        () => [
            {
                Header: "Car",
                accessor: "car_plate",
                Filter: SelectColumnFilter,
                filter: 'equals' // by default, filter: 'text', but in our case we don't want to filter options like text, we want to find exact match of selected option.
            },
            {
                Header: "KM's",
                accessor: "car_km",
                disableFilters: true

            },
            {
                Header: "Quantity (l)",
                accessor: "quantity",
                disableSortBy: true,
                disableFilters: true

            },
            {
                Header: "Price (€/l)",
                accessor: "price",
                disableSortBy: true,
                disableFilters: true

            },
            {
                Header: "Author",
                accessor: "author",
                disableSortBy: true,
                disableFilters: true

            },
            {
                Header: "Time",
                accessor: "createdAt",
                disableFilters: true

            },
        ],
        []
    )


    return (
        <>

            <Link to="/gas/add">
                <button className="btn_insert">Insert Gas Report</button>
            </Link>

            <Container style={{ marginTop: 100 }}>
                <TableContainer columns={columns} data={gasReports} />
            </Container>
            {/*{gasReports.length > 0 && gasReports.map(gasReports => (
        <GasReports key={gasReports._id} {...gasReports} />
      ))}*/}
        </>
    );
}