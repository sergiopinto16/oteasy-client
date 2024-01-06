


import { useContext, useEffect, useState, useRef } from "react";
import {Navigate, useParams} from "react-router-dom";
// import {UserContext} from "../UserContext";
import SpmRadioAnswer from "../../components/SpmRadioAnswer";
import './Spm.css'
import calc_SPMescola, { calc_a, calc_cc, calc_go, calc_me, calc_pmi, calc_ps, calc_pv, calc_t, calc_v, calc_total } from "./calc/calcSpmEscola";
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
import { UserContext } from "../../UserContext";



import config from '../../config/config.json';

const api_host = config.api.host
const spm_type = 1


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



export default function SPMEscola() {

    const { userInfo, setUserInfo } = useContext(UserContext);
    const {client_id} = useParams();

    if (userInfo?.email === undefined) {
        console.log("Not logged, return to home")
        window.location.replace("/");
    }

    document.title += " - SPM ESCOLA"

    const [valueArray, setValueArray] = useState([]);
    const [questionArray, setQuestionArray] = useState([]);

    const [sumQuestions, setsumQuestions] = useState([]);
    const [scoreQuestions, setscoreQuestions] = useState([]);
    const [tsQuestions, settsQuestions] = useState([]);
    const [classificacaoQuestions, setclassificacaoQuestions] = useState([]);

    const [updateTabel, setupdateTable] = useState(0)

    const chartRef = useRef(null);

    const [SpmRadioAnswerText, setSpmRadioAnswerText] = useState(["Nunca", "N", "Ocasionalmente", "O", "Frequentemente", "F", "Sempre", "S"])
    let minWidth_graph = window.innerWidth;

    if (minWidth_graph > 700) {
        minWidth_graph = 700;
    }
    const [redirect, setRedirect] = useState(false);
    const [url, setUrl] = useState('');


    // const tsQuestions_data = [{ name: 'Participação Social', tscore: 0 },
    // { name: 'Visão', tscore: 0 },
    // { name: 'Audição', tscore: 0 },
    // { name: 'Toque', tscore: 0 },
    // { name: 'Gosto e Olfato', tscore: 0 },
    // { name: 'Consciência Corporal', tscore: 0 },
    // { name: 'Movimento e Equilibrio', tscore: 0 },
    // { name: 'Planeamento Motor e Ideação', tscore: 0 },
    // { name: 'TOTAL', tscore: 0 },];

    const [tsQuestions_data, settsQuestions_data] = useState([]);




    const getRadioValue = (name, value) => {
        console.log("SPMEscola - " + name + ' | ' + value)
        // setValueArray([
        //     { id: name, value: value }
        //   ])

        // setValueArray([
        //     ...valueArray,
        //     {
        //       id: name,
        //       value: value
        //     }
        //   ]); 

        valueArray[name] = value
        let index = parseInt(name.split("_")[1]);
        questionArray[index] = value
        // console.log(valueArray)
        calculate_spm()
    }

    //TODO create all funtions to calculate all block
    //TODO functions will return sum value
    const calculate_question_group = (indexStart, indexEnd, invertido) => {

        let sumaux = 0
        let valueaux = 0
        for (let i_var = indexStart; i_var <= indexEnd; i_var++) {
            // console.log('question_'+i_var)
            // console.log(valueArray['question_'+i_var])
            if (valueArray['question_' + i_var] != null) {
                valueaux = parseInt(valueArray['question_' + i_var])
                if (invertido && valueaux > 0) {
                    valueaux = 5 - valueaux
                }
                sumaux += valueaux
            }
        }
        return sumaux

    }

    const calculate_spm = () => {

        sumQuestions[questionGroup_PS] = calculate_question_group(1, 10, true)
        sumQuestions[questionGroup_V] = calculate_question_group(11, 17, false)
        sumQuestions[questionGroup_A] = calculate_question_group(18, 24, false)
        sumQuestions[questionGroup_T] = calculate_question_group(25, 32, false)
        sumQuestions[questionGroup_GO] = calculate_question_group(33, 36, false)
        sumQuestions[questionGroup_CC] = calculate_question_group(37, 43, false)
        sumQuestions[questionGroup_ME] = calculate_question_group(44, 52, false)
        sumQuestions[questionGroup_PMI] = calculate_question_group(53, 62, false)

        console.log('PS = ' + sumQuestions[questionGroup_PS])
        console.log('V  = ' + sumQuestions[questionGroup_V])
        console.log('A  = ' + sumQuestions[questionGroup_A])
        console.log('T  = ' + sumQuestions[questionGroup_T])
        console.log('GO = ' + sumQuestions[questionGroup_GO])
        console.log('CC = ' + sumQuestions[questionGroup_CC])
        console.log('ME = ' + sumQuestions[questionGroup_ME])
        console.log('PMI= ' + sumQuestions[questionGroup_PMI])
        console.log('TOTAL= ' + sumQuestions[questionGroup_TOTAL])


        console.log("Calculate score and ts")
        // console.log(calc_ps(sumQuestions[questionGroup_PS])['score_group'])
        scoreQuestions[questionGroup_PS] = calc_ps(sumQuestions[questionGroup_PS])['score_group']
        scoreQuestions[questionGroup_V] = calc_v(sumQuestions[questionGroup_V])['score_group']
        scoreQuestions[questionGroup_A] = calc_a(sumQuestions[questionGroup_A])['score_group']
        scoreQuestions[questionGroup_T] = calc_t(sumQuestions[questionGroup_T])['score_group']
        scoreQuestions[questionGroup_GO] = calc_go(sumQuestions[questionGroup_GO])['score_group']
        scoreQuestions[questionGroup_CC] = calc_cc(sumQuestions[questionGroup_CC])['score_group']
        scoreQuestions[questionGroup_ME] = calc_me(sumQuestions[questionGroup_ME])['score_group']
        scoreQuestions[questionGroup_PMI] = calc_pmi(sumQuestions[questionGroup_PMI])['score_group']



        tsQuestions[questionGroup_PS] = calc_ps(sumQuestions[questionGroup_PS])['tscore_group']
        tsQuestions[questionGroup_V] = calc_v(sumQuestions[questionGroup_V])['tscore_group']
        tsQuestions[questionGroup_A] = calc_a(sumQuestions[questionGroup_A])['tscore_group']
        tsQuestions[questionGroup_T] = calc_t(sumQuestions[questionGroup_T])['tscore_group']
        tsQuestions[questionGroup_GO] = calc_go(sumQuestions[questionGroup_GO])['tscore_group']
        tsQuestions[questionGroup_CC] = calc_cc(sumQuestions[questionGroup_CC])['tscore_group']
        tsQuestions[questionGroup_ME] = calc_me(sumQuestions[questionGroup_ME])['tscore_group']
        tsQuestions[questionGroup_PMI] = calc_pmi(sumQuestions[questionGroup_PMI])['tscore_group']



        classificacaoQuestions[questionGroup_PS] = calc_ps(sumQuestions[questionGroup_PS])['classificacao_group_int']
        classificacaoQuestions[questionGroup_V] = calc_v(sumQuestions[questionGroup_V])['classificacao_group_int']
        classificacaoQuestions[questionGroup_A] = calc_a(sumQuestions[questionGroup_A])['classificacao_group_int']
        classificacaoQuestions[questionGroup_T] = calc_t(sumQuestions[questionGroup_T])['classificacao_group_int']
        classificacaoQuestions[questionGroup_GO] = calc_go(sumQuestions[questionGroup_GO])['classificacao_group_int']
        classificacaoQuestions[questionGroup_CC] = calc_cc(sumQuestions[questionGroup_CC])['classificacao_group_int']
        classificacaoQuestions[questionGroup_ME] = calc_me(sumQuestions[questionGroup_ME])['classificacao_group_int']
        classificacaoQuestions[questionGroup_PMI] = calc_pmi(sumQuestions[questionGroup_PMI])['classificacao_group_int']


        let tscoreTOTAL = tsQuestions[0] + tsQuestions[1] + tsQuestions[2] + tsQuestions[3] + tsQuestions[4] + tsQuestions[5] + tsQuestions[6] + tsQuestions[7]
        scoreQuestions[questionGroup_TOTAL] = calc_total(tscoreTOTAL)['score_group']
        tsQuestions[questionGroup_TOTAL] = calc_total(tscoreTOTAL)['tscore_group']
        classificacaoQuestions[questionGroup_TOTAL] = calc_total(tscoreTOTAL)['classificacao_group_int']


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

        console.log(scoreQuestions, tsQuestions, classificacaoQuestions)
        console.log('tsQuestions_data')
        console.log(tsQuestions_data)


        setupdateTable((prevCount) => prevCount + 1);
    }

    async function calculate_spm_escola(ev) {
        ev.preventDefault();

        if (!window.confirm('Are you sure?')) {
            return;
        }

        console.log("No refresh page")

        //spmPDF();



        // const base64Image = chartRef.current.chartInstance.toBase64Image();



        // setupdateTable((prevCount) => prevCount + 1);

        console.log(valueArray)
        console.log(questionArray)

        fetch(api_host + '/api/spm/add', {
            method: 'POST',
            body: JSON.stringify({
                "spm_type": spm_type,
                "evaluation_date": "2023-04-28 19:02",
                "valueArray": questionArray,
                "evaluation_reason": "evaluation reason",
                scoreQuestions,
                tsQuestions,
                classificacaoQuestions,
                client_id
            }),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Erro with db connect")
        }).then((responseJson) => {
            //DO something with responseJSON
            console.log(responseJson);
            console.log(responseJson._id);
            setUrl('../' + responseJson._id);
            setRedirect(true);
        }).catch((error) => {
            alert(error);
        });

    };






    const tableElement = useRef()
    const graphElement = useRef()



    useEffect(() => {
        // CustomizedTables(scoreQuestions, classificacaoQuestions)
        console.log("useEffect runs!")

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
    }, [updateTabel])

    if (redirect) {
        //TODO redirect to dashboard
        // return <Navigate to={'/gas/gasReports'} />
        window.location.href = url
    };

    //   if (redirect) {
    //     return <Navigate to={'/'} />
    //   }
    return (
        <form className="spm_escola" >


            <div className="button_form_download" >
                <button className="spm_escola" onClick={() => window.open(require('../../static/SPM/docs/SPM_Escola_TUDO_COMPLETO(5-12Anos).pdf'), '_none')}> Donwload Formulário</button>
            </div>

            <h1 className="title spm_escola">SPM ESCOLA</h1>

            <div id="PS" className="question_group" >

                <h1 className="spm_escola">PARTICIPAÇÃO SOCIAL Este aluno ...</h1>

                <div className="question">
                    <p>1. Trabalha em equipa; é prestável com os outros.</p>
                    <SpmRadioAnswer name={"question_1"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>2. Resolve conflitos com os colegas sem intervenção do professor.</p>
                    <SpmRadioAnswer name={"question_2"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>3. Lida com a frustração sem explodir ou demonstrar comportamentos
                        agressivos.</p>
                    <SpmRadioAnswer name={"question_3"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>4. Brinca, de bom grado, com os colegas numa variedade de jogos e
                        atividades.</p>
                    <SpmRadioAnswer name={"question_4"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>5. Entra nas brincadeiras com os colegas sem interromper o decorrer
                        da atividade.</p>
                    <SpmRadioAnswer name={"question_5"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>6. Tem amigos e escolhe estar com eles quando é possível.</p>
                    <SpmRadioAnswer name={"question_6"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>7. Usa e percebe o humor quando brinca com os colegas.</p>
                    <SpmRadioAnswer name={"question_7"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>8. Mantém “espaço pessoal” adequado (não fica demasiado perto dos
                        outros durante uma conversa).</p>
                    <SpmRadioAnswer name={"question_8"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>9. Mantém contacto visual adequado durante uma conversa.</p>
                    <SpmRadioAnswer name={"question_9"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>10. Muda os temas de conversa de acordo com os interesses dos
                        colegas; não fica fixo a um só tema.</p>
                    <SpmRadioAnswer name={"question_10"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="resultado">
                    <p>PARTICIPAÇÃO SOCIAL = {sumQuestions[questionGroup_PS]}</p>
                    <p>% score = {scoreQuestions[questionGroup_PS]} % | T-score = {tsQuestions[questionGroup_PS]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_PS]} /></p>


                </div>
            </div>


            <div id="VISAO" className="question_group">


                <h1 className="spm_escola">VISÃO Este aluno ...</h1>


                <div className="question">
                    <p>11. Semicerra, tapa os olhos ou queixa-se da iluminação da sala de
                        aula ou da luz solar intensa.</p>
                    <SpmRadioAnswer name={"question_11"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>12. Mostra-se aflito/perturbado ao ver objetos em movimento.</p>
                    <SpmRadioAnswer name={"question_12"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>13. Distrai-se com estímulos visuais próximos (imagens, coisas nas
                        paredes, janelas, outras crianças).</p>
                    <SpmRadioAnswer name={"question_13"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>14. Enquanto são dadas instruções ou informações, o aluno olha à sua
                        volta ou para os colegas, em vez de olhar para a
                        pessoa que está a falar ou para o quadro.</p>
                    <SpmRadioAnswer name={"question_14"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>15. Enquanto são dadas instruções ou informações, o aluno olha à sua
                        volta ou para os colegas, em vez de olhar para a
                        pessoa que está a falar ou para o quadro.</p>
                    <SpmRadioAnswer name={"question_15"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>16. Olha fixamente para pessoas ou objetos.</p>
                    <SpmRadioAnswer name={"question_16"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>17. Mostra-se aflito/perturbado quando as luzes são diminuídas para
                        filmes e apresentações.</p>
                    <SpmRadioAnswer name={"question_17"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="resultado">
                    <p>VISÃO = {sumQuestions[questionGroup_V]}</p>
                    <p>% score = {scoreQuestions[questionGroup_V]} % | T-score = {tsQuestions[questionGroup_V]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_V]} /></p>

                </div>
            </div>


            <div id="AUDICAO" className="question_group">

                <h1 className="spm_escola">AUDIÇÃO Este aluno ...</h1>



                <div className="question">
                    <p>18. Mostra-se aflito/perturbado com sons altos (bater da porta,
                        aparelhos elétricos, campainha da escola, alarme de
                        incêndio).</p>
                    <SpmRadioAnswer name={"question_18"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>19. Mostra-se aflito/perturbado com sons de canções ou de
                        instrumentos musicais.</p>
                    <SpmRadioAnswer name={"question_19"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>20. Não responde a vozes ou sons novos.</p>
                    <SpmRadioAnswer name={"question_20"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>21. Não responde a vozes ou sons novos</p>
                    <SpmRadioAnswer name={"question_21"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>



                <div className="question">
                    <p>22. Faz barulhos, murmura, canta, ou grita durante momentos
                        silenciosos da aula.</p>
                    <SpmRadioAnswer name={"question_22"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>23. Fala muito alto ou faz excessivo barulho durante as transições
                        (quando muda de atividade ou de espaço).</p>
                    <SpmRadioAnswer name={"question_23"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} />
                </div>

                <div className="question">
                    <p>24. Fala muito alto ou faz excessivo barulho durante as transições
                        (quando muda de atividade ou de espaço).</p>
                    <SpmRadioAnswer name={"question_24"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>



                <div className="resultado">
                    <p>AUDIÇÃO = {sumQuestions[questionGroup_A]}</p>
                    <p>% score = {scoreQuestions[questionGroup_A]} % | T-score = {tsQuestions[questionGroup_A]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_A]} /></p>

                </div>

            </div>



            <div id="TOQUE" className="question_group">


                <h1 className="spm_escola">TOQUE Este aluno ...</h1>

                <div className="question">

                    <p>25. Mostra-se aflito/perturbado quando as mãos ou a cara estão sujas
                        (com cola, digitintas, comida, sujidade, etc).</p>
                    <SpmRadioAnswer name={"question_25"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>26. Não tolera sujidade nas mãos ou roupa, mesmo que por pouco
                        tempo.</p>
                    <SpmRadioAnswer name={"question_26"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>27. Mostra-se aflito/perturbado quando toca em certas texturas
                        (materiais da sala de aula, utensílios, equipamentos
                        desportivos, etc).</p>
                    <SpmRadioAnswer name={"question_27"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>28. Fica aflito/perturbado quando é tocado acidentalmente pelos
                        colegas (pode ter uma resposta agressiva ou afastarse).</p>
                    <SpmRadioAnswer name={"question_28"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>29. Não responde ao toque dos outros.</p>
                    <SpmRadioAnswer name={"question_29"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>


                <div className="question">
                    <p>30. Procura temperaturas quentes ou frias tocando em janelas, outras
                        superfícies.</p>
                    <SpmRadioAnswer name={"question_30"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>31. Procura temperaturas quentes ou frias tocando em janelas, outras
                        superfícies.</p>
                    <SpmRadioAnswer name={"question_31"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>32. Não limpa a saliva ou a comida da cara.</p>
                    <SpmRadioAnswer name={"question_32"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="resultado">
                    <p>TOQUE = {sumQuestions[questionGroup_T]}</p>
                    <p>% score = {scoreQuestions[questionGroup_T]} % | T-score = {tsQuestions[questionGroup_T]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_T]} /></p>

                </div>

            </div>



            <div id="GOSTO_E_OLFATO" className="question_group">


                <h1 className="spm_escola">GOSTO E OLFATO Este aluno ...</h1>


                <div className="question">

                    <p>33. Mostra-se aflito/perturbado com sabores ou cheiros de diferentes
                        comidas.</p>
                    <SpmRadioAnswer name={"question_33"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>34. Não se apercebe de cheiros fortes ou invulgares (cola, tinta,
                        marcadores, etc).</p>
                    <SpmRadioAnswer name={"question_34"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>35. Não consegue distinguir odores; não prefere bons cheiros a maus
                        cheiros.</p>
                    <SpmRadioAnswer name={"question_35"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>36. Tenta provar ou lamber objetos ou pessoas.</p>
                    <SpmRadioAnswer name={"question_36"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>


                <div className="resultado">
                    <p>GOSTO E OLFATO = {sumQuestions[questionGroup_GO]}</p>
                    <p>% score = {scoreQuestions[questionGroup_GO]} % | T-score = {tsQuestions[questionGroup_GO]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_GO]} /></p>


                </div>
            </div>


            <div id="CONSCIENCIA_CORPORAL" className="question_group">



                <h1 className="spm_escola">CONSCIÊNCIA CORPORAL Este aluno ...</h1>

                <div className="question">

                    <p>37. Entorna os conteúdos quando abre recipientes.</p>
                    <SpmRadioAnswer name={"question_37"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>38. Mastiga ou leva à boca roupa, lápis, lápis de cera, ou materiais
                        escolares.</p>
                    <SpmRadioAnswer name={"question_38"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>39. Move a cadeira bruscamente (empurra a cadeira para debaixo da
                        mesa ou puxa a cadeira com muita força).</p>
                    <SpmRadioAnswer name={"question_39"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>40. Corre, saltita, ou pula em vez de andar.</p>
                    <SpmRadioAnswer name={"question_40"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>


                <div className="question">
                    <p>41. Anda com “pés pesados” ou bate com os pés no chão quando anda.</p>
                    <SpmRadioAnswer name={"question_41"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>42. Salta ou anda com “pés pesados” quando sobe ou desce escadas.</p>
                    <SpmRadioAnswer name={"question_42"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>43. Bate as portas ou abre-as com demasiada força.</p>
                    <SpmRadioAnswer name={"question_43"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>



                <div className="resultado">
                    <p>CONSCIÊNCIA CORPORAL = {sumQuestions[questionGroup_CC]}</p>
                    <p>% score = {scoreQuestions[questionGroup_CC]} % | T-score = {tsQuestions[questionGroup_CC]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_CC]} /></p>

                </div>
            </div>


            <div id="MOVIMENTO_E_EQILIBRIO" className="question_group">


                <h1 className="spm_escola">MOVIMENTO E EQUILIBRIO Este aluno ...</h1>


                <div className="question">

                    <p>44. Passa as mãos ao longo da parede quando anda.</p>
                    <SpmRadioAnswer name={"question_44"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>45. Enrola as pernas à volta das pernas da cadeira.</p>
                    <SpmRadioAnswer name={"question_45"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>



                <div className="question">
                    <p>46. Baloiça na cadeira quando sentado à secretária ou mesa.</p>
                    <SpmRadioAnswer name={"question_46"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>47. Fica irrequieto quando está sentado à secretária ou mesa.</p>
                    <SpmRadioAnswer name={"question_47"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>48. Cai da cadeira quando está sentado à secretária ou mesa.</p>
                    <SpmRadioAnswer name={"question_48"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>49. Encosta-se nas paredes, móveis, ou em outras pessoas para se
                        apoiar quando está de pé.</p>
                    <SpmRadioAnswer name={"question_49"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>50. Quando está sentado no chão, não consegue manter-se sem apoio.</p>
                    <SpmRadioAnswer name={"question_50"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>51. Escorrega, deita-se na secretária, ou segura a cabeça com as
                        mãos quando sentado à secretária.</p>
                    <SpmRadioAnswer name={"question_51"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>52.Tem pouca coordenação; parece desajeitado.</p>
                    <SpmRadioAnswer name={"question_52"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>


                <div className="resultado">
                    <p>MOVIMENTO E EQUILIBRIO = {sumQuestions[questionGroup_ME]}</p>
                    <p>% score = {scoreQuestions[questionGroup_ME]} % | T-score = {tsQuestions[questionGroup_ME]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_ME]} /></p>
                </div>
            </div>



            <div id="PLANEAMENTO_MOTOR_E_IDEACAO" className="question_group" >


                <h1 className="spm_escola">PLANEAMENTO MOTOR E IDEAÇÃO Este aluno ...</h1>

                <div className="question">

                    <p>53. Não desempenha as tarefas diárias de forma consistente; a
                        qualidade do trabalho varia consideravelmente.</p>
                    <SpmRadioAnswer name={"question_53"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>54. É incapaz de resolver problemas eficazmente.</p>
                    <SpmRadioAnswer name={"question_54"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>55. É incapaz de resolver problemas eficazmente.</p>
                    <SpmRadioAnswer name={"question_55"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>


                <div className="question">
                    <p>56. Não desempenha as tarefas numa sequência adequada.</p>
                    <SpmRadioAnswer name={"question_56"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>57. Não desempenha as tarefas numa sequência adequada.</p>
                    <SpmRadioAnswer name={"question_57"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>58. Tem dificuldade em imitar corretamente demonstrações (jogos de
                        movimento, canções com movimentos).</p>
                    <SpmRadioAnswer name={"question_58"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>59. Tem dificuldade em completar tarefas segundo um modelo
                        apresentado.</p>
                    <SpmRadioAnswer name={"question_59"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>60. Demonstra pouca imaginação e criatividade no brincar e nos
                        tempos livres (tal como ser incapaz de criar jogos
                        novos).</p>
                    <SpmRadioAnswer name={"question_60"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>61. Brinca repetitivamente durante os tempos livres; não desenvolve
                        nem altera a atividade quando lhe é dada a
                        oportunidade.</p>
                    <SpmRadioAnswer name={"question_61"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="question">

                    <p>62. Mostra pouca organização dos materiais dentro, em cima e na área
                        à volta da secretária.</p>
                    <SpmRadioAnswer name={"question_62"} color={"orange"} callbackValueRadio={getRadioValue} text={SpmRadioAnswerText} /></div>

                <div className="resultado">
                    <p>PLANEAMENTO MOTOR E IDEAÇÃO= {sumQuestions[questionGroup_PMI]}</p>
                    <p>% score = {scoreQuestions[questionGroup_PMI]} % | T-score = {tsQuestions[questionGroup_PMI]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_PMI]} /></p>

                </div>


            </div>


            <div className="spm_calculate_button">

                <button className="spm_escola" onClick={calculate_spm_escola}>Save SPM</button>



            </div>





        </form>
    );
}