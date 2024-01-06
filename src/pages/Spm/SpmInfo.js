


import {Navigate, useParams} from "react-router-dom";
// import {UserContext} from "../UserContext";
import SpmRadioAnswer from "../../components/SpmRadioAnswer";
import './Spm.css'
import calc_SpmCasa, { calc_a, calc_cc, calc_go, calc_me, calc_pmi, calc_ps, calc_pv, calc_t, calc_v, calc_total } from "./calc/calcSpmCasa";
import CustomizedTables from './components/table';
import TextClassificacaoNivel from './components/table'
import GraphSPM from './components/graph'


import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { StyledTableCell, StyledTableRow, createData } from './components/table'

import ReactPDF from '@react-pdf/renderer';

import { spmPDF } from './components/pdf';
import TableWithRadioButtons from '../../components/SpmTableQuestionGroup'
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas'

import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../UserContext";


import config from '../../config/config.json';

const api_host = config.api.host
const spm_type = 0


const questionGroup_PS = 0;
const questionGroup_V = 1;
const questionGroup_A = 2;
const questionGroup_T = 3;
const questionGroup_GO = 4;
const questionGroup_CC = 5;
const questionGroup_ME = 6;
const questionGroup_PMI = 7;
const questionGroup_TOTAL = 8;



let rows = [
    createData('Participação Social', 0, 0),
    createData('Visão', 0, 0),
    createData('Audição', 0, 0),
    createData('Toque', 0, 0),
    // createData('Gosto e Olfato', 0, 0),
    createData('Consciência Corporal', 0, 0),
    createData('Movimento e Equilibrio', 0, 0),
    createData('Planeamento Motor e Ideação', 0, 0),
    createData('TOTAL', 0, 0)
];





export default function SpmCasa() {

    const { userInfo, setUserInfo } = useContext(UserContext);
    const {spm_id} = useParams();

    // if (userInfo?.email === undefined) {
    //     console.log("Not logged, return to home")
    //     window.location.replace("/");
    // }

    document.title += " - SPM INFO"


    const [valueArray, setValueArray] = useState([]);
    const [questionArray, setQuestionArray] = useState([]);

    const [sumQuestions, setsumQuestions] = useState([]);
    const [scoreQuestions, setscoreQuestions] = useState([]);
    const [tsQuestions, settsQuestions] = useState([]);
    const [classificacaoQuestions, setclassificacaoQuestions] = useState([]);

    const [updateTabel, setupdateTable] = useState(0)

    const chartRef = useRef(null);

    const [SpmRadioAnswerText, setSpmRadioAnswerText] = useState(["Nunca", "N", "Ocasionalmente", "O", "Frequentemente", "F", "Sempre", "S"]);
    let minWidth_graph = window.innerWidth;

    if (minWidth_graph > 700) {
        minWidth_graph = 700;
    }

    const [redirect, setRedirect] = useState(false);
    const [tsQuestions_data, settsQuestions_data] = useState([]);

    const tableElement = useRef()
    const graphElement = useRef()


    //TODO: spmPDF

    async function downloadElement(ev, domElement) {

        ev.preventDefault();

        console.log("donwload element");

        html2canvas(domElement).then(canvas => {
            saveAs(canvas.toDataURL(), 'element.png');

        });
    };


    function saveAs(uri, filename) {

        var link = document.createElement('a');

        if (typeof link.download === 'string') {

            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);

        } else {

            window.open(uri);

        }
    }

    const update_tsQuestions = (values) => {

        tsQuestions[0] = values[0]
        tsQuestions[1] = values[1]
        tsQuestions[2] = values[2]
        tsQuestions[3] = values[3]
        tsQuestions[4] = values[4]
        tsQuestions[5] = values[5]
        tsQuestions[6] = values[6]
        tsQuestions[7] = values[7]
        tsQuestions[8] = values[8]
    }
    const update_classificacaoQuestions = (values) => {

        classificacaoQuestions[0] = values[0]
        classificacaoQuestions[1] = values[1]
        classificacaoQuestions[2] = values[2]
        classificacaoQuestions[3] = values[3]
        classificacaoQuestions[4] = values[4]
        classificacaoQuestions[5] = values[5]
        classificacaoQuestions[6] = values[6]
        classificacaoQuestions[7] = values[7]
        classificacaoQuestions[8] = values[8]
    }

    const update_scoreQuestions = (values) => {

        scoreQuestions[0] = values[0]
        scoreQuestions[1] = values[1]
        scoreQuestions[2] = values[2]
        scoreQuestions[3] = values[3]
        scoreQuestions[4] = values[4]
        scoreQuestions[5] = values[5]
        scoreQuestions[6] = values[6]
        scoreQuestions[7] = values[7]
        scoreQuestions[8] = values[8]
    }
    
    
    useEffect(() => {
        // CustomizedTables(scoreQuestions, classificacaoQuestions)
        console.log("useEffect start!")

        console.log("SPM id = " + spm_id)
        fetch(api_host + '/api/spm/spm/' + spm_id, {credentials: 'include'}).then(response => {
            response.json().then(spm => {
                console.log(spm);
                // setscoreQuestions(spm.group_score);
                // settsQuestions(spm.group_tsocre);
                // setclassificacaoQuestions(spm.group_comment);

                update_tsQuestions(spm.group_score);
                update_tsQuestions(spm.group_tsocre);
                update_classificacaoQuestions(spm.group_comment);


                switch (spm.spm_type) {
                    case 0:
                        document.title = "SPM CASA"
                    case 1:
                        document.title = "SPM ESCOLA"
                    case 2:
                        document.title = "SPM-p CASA"
                    case 3:
                        document.title = "SPM-p ESCOLA"
                    default:
                        document.title = "SPM INFO"
                }


                console.log(tsQuestions)
                console.log(classificacaoQuestions)

                rows = [
                    createData('Participação Social', tsQuestions[0], classificacaoQuestions[0]),
                    createData('Visão', tsQuestions[1], classificacaoQuestions[1]),
                    createData('Audição', tsQuestions[2], classificacaoQuestions[2]),
                    createData('Toque', tsQuestions[3], classificacaoQuestions[3]),
                    // createData('Gosto e Olfato', scoreQuestions[4], classificacaoQuestions[4]),
                    createData('Consciência Corporal', tsQuestions[5], classificacaoQuestions[5]),
                    createData('Movimento e Equilibrio', tsQuestions[6], classificacaoQuestions[6]),
                    createData('Planeamento Motor e Ideação', tsQuestions[7], classificacaoQuestions[7]),
                    createData('TOTAL', tsQuestions[8], classificacaoQuestions[8]),
                ];

                console.log(rows)


                let data = [
                    { name: 'Participação Social', tscore: tsQuestions[questionGroup_PS] },
                    { name: 'Visão', tscore: tsQuestions[questionGroup_V] },
                    { name: 'Audição', tscore: tsQuestions[questionGroup_A] },
                    { name: 'Toque', tscore: tsQuestions[questionGroup_T] },
                    // { name: 'Gosto e Olfato', tscore: tsQuestions[questionGroup_GO] },
                    { name: 'Consciência Corporal', tscore: tsQuestions[questionGroup_CC] },
                    { name: 'Movimento e Equilibrio', tscore: tsQuestions[questionGroup_ME] },
                    { name: 'Planeamento Motor e Ideação', tscore: tsQuestions[questionGroup_PMI] },
                    { name: 'TOTAL', tscore: tsQuestions[questionGroup_TOTAL] },];

                settsQuestions_data(data)
            });
        });


    }, [updateTabel])



    if (redirect) {
        //TODO redirect to dashboard
        // return <Navigate to={'/gas/gasReports'} />
    };

    //   if (redirect) {
    //     return <Navigate to={'/'} />
    //   }



    return (

        <form className="spm_casa"  >

            {/*
            Add Utent info,
            Add edited comment of spm
            Add edited reaseaon of spm 

            */}

            {/* //TODO minimize all question and create a button (option) to open (show) questions to answer */}

            <div className="button_form_download" >
                <button className="spm_casa" onClick={() => window.open(require('../../static/SPM/docs/SPM_Casa_TUDO_COMPLETO(5-12Anos).pdf'), '_none')}> Donwload Formulário </button>
            </div>

            <h1 className="title spm_casa" >SPM INFO</h1>

            {/*TODO: Add type of spm, notes*/}
            {/*Add utent info*/}


            <div className="spm_table">



                {/* <CustomizedTables scoreQuestions classificacaoQuestions/> */}

                <div ref={tableElement}>
                    {/* <p>Count {updateTabel}</p> */}

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: minWidth_graph }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Avaliação</StyledTableCell>
                                    <StyledTableCell align="right">Pontuação</StyledTableCell>
                                    <StyledTableCell align="right">Comentário</StyledTableCell>
                                    {/* <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell> */}
                                </TableRow>
                            </TableHead>



                            <TableBody>
                                {rows.map((row) => (
                                    <StyledTableRow key={row.name}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{row.pontuacao}</StyledTableCell>
                                        <StyledTableCell align="right">{row.comentario}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div >



                <button className="button_download_graph spm_casa" onClick={(ev) => downloadElement(ev, tableElement.current)}>Download Table</button>

            </div>


            <div className="spm_graph">



                <div ref={graphElement} >
                    <GraphSPM tsQuestions_data={tsQuestions_data} ref={chartRef} width_size={minWidth_graph} />
                </div>

                <button className="button_download_table spm_casa" onClick={(ev) => downloadElement(ev, graphElement.current)}>Download Graph</button>



            </div>

        </form >
    );
}







