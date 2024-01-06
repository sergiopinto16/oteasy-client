import {Navigate, useParams} from "react-router-dom";
// import {UserContext} from "../UserContext";
import SpmRadioAnswer from "../../components/SpmRadioAnswer";
import './Spm.css'
import calc_SpmCasa, {
    calc_a,
    calc_cc,
    calc_go,
    calc_me,
    calc_pmi,
    calc_ps,
    calc_pv,
    calc_t,
    calc_v,
    calc_total
} from "./calc/calcSpmCasa";
import CustomizedTables from './components/table';
import TextClassificacaoNivel from './components/table'
import GraphSPM from './components/graph'


import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {StyledTableCell, StyledTableRow, createData} from './components/table'

import ReactPDF from '@react-pdf/renderer';

import {spmPDF} from './components/pdf';
import TableWithRadioButtons from '../../components/SpmTableQuestionGroup'
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas'

import {useContext, useEffect, useState, useRef} from "react";
import {UserContext} from "../../UserContext";


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

    const {userInfo, setUserInfo} = useContext(UserContext);
    const {client_id} = useParams();

    if (userInfo?.email === undefined) {
        console.log("Not logged, return to home")
        window.location.replace("/");
    }

    document.title += " - SPM CASA"


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
    const [url, setUrl] = useState('');


    // console.log("SpmRadioAnswer")
    // console.log(isMobile)
    // console.log(window.innerWidth)

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
        console.log("SpmCasa - " + name + ' | ' + value)
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
        // console.log("slipt name = " + name.split("_")[1])
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
        sumQuestions[questionGroup_V] = calculate_question_group(11, 21, false)
        sumQuestions[questionGroup_A] = calculate_question_group(22, 29, false)
        sumQuestions[questionGroup_T] = calculate_question_group(30, 40, false)
        sumQuestions[questionGroup_GO] = calculate_question_group(41, 45, false)
        sumQuestions[questionGroup_CC] = calculate_question_group(46, 55, false)
        sumQuestions[questionGroup_ME] = calculate_question_group(56, 66, false)
        sumQuestions[questionGroup_PMI] = calculate_question_group(67, 75, false)

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
            {name: 'Participação Social', tscore: tsQuestions[questionGroup_PS]},
            {name: 'Visão', tscore: tsQuestions[questionGroup_V]},
            {name: 'Audição', tscore: tsQuestions[questionGroup_A]},
            {name: 'Toque', tscore: tsQuestions[questionGroup_T]},
            // { name: 'Gosto e Olfato', tscore: tsQuestions[questionGroup_GO] },
            {name: 'Consciência Corporal', tscore: tsQuestions[questionGroup_CC]},
            {name: 'Movimento e Equilibrio', tscore: tsQuestions[questionGroup_ME]},
            {name: 'Planeamento Motor e Ideação', tscore: tsQuestions[questionGroup_PMI]},
            {name: 'TOTAL', tscore: tsQuestions[questionGroup_TOTAL]},];

        settsQuestions_data(data)

        console.log(scoreQuestions, tsQuestions, classificacaoQuestions)
        console.log('tsQuestions_data')
        console.log(tsQuestions_data)


        setupdateTable((prevCount) => prevCount + 1);
    }

    async function calculate_spm_casa(ev) {
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
    }
    ;

    //   if (redirect) {
    //     return <Navigate to={'/'} />
    //   }


    return (

        <form className="spm_casa">

            {/* //TODO minimize all question and create a button (option) to open (show) questions to answer */}

            <div className="button_form_download">
                <button className="spm_casa"
                        onClick={() => window.open(require('../../static/SPM/docs/SPM_Casa_TUDO_COMPLETO(5-12Anos).pdf'), '_none')}> Donwload
                    Formulário
                </button>
            </div>

            <h1 className="title spm_casa">SPM CASA</h1>


            <div id="PS" className="question_group">

                <h1 className="spm_casa">PARTICIPAÇÃO SOCIAL A criança ...</h1>

                <div className="question">
                    <p>1. Brinca com os amigos cooperativamente (sem muita argumentação)?</p>
                    <SpmRadioAnswer name={"question_1"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>2. Interage adequadamente com os pais e outros adultos
                        significativos para a criança (comunica bem, segue indicações,
                        mostra respeito, etc)?</p>
                    <SpmRadioAnswer name={"question_2"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>3. Partilha as coisas quando solicitada?</p>
                    <SpmRadioAnswer name={"question_3"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>4. Mantém uma conversa sem se sentar ou aproximar demasiado dos
                        outros?</p>
                    <SpmRadioAnswer name={"question_4"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>5. Mantém contacto visual adequado durante uma conversa?</p>
                    <SpmRadioAnswer name={"question_5"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>6. Junta-se aos outros para brincar sem perturbar a atividade em
                        curso?</p>
                    <SpmRadioAnswer name={"question_6"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>7. Durante as refeições, toma parte da conversa e interage de um
                        modo adequado?</p>
                    <SpmRadioAnswer name={"question_7"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>8. Participa adequadamente em saídas familiares, tais como jantar
                        fora, ir ao parque, museu, cinema ou centro comercial?</p>
                    <SpmRadioAnswer name={"question_8"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>9. Participa adequadamente em encontros familiares, tais como
                        férias, casamentos ou aniversários?</p>
                    <SpmRadioAnswer name={"question_9"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>10. Participa adequadamente em atividades com amigos como festas, ir
                        ao centro comercial, andar de
                        bicicleta/skate/mota?</p>
                    <SpmRadioAnswer name={"question_10"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="resultado">
                    <p>PARTICIPAÇÃO SOCIAL = {sumQuestions[questionGroup_PS]}</p>
                    <p>% score = {scoreQuestions[questionGroup_PS]} % | T-score = {tsQuestions[questionGroup_PS]} </p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_PS]}/></p>

                </div>


            </div>


            <div id="VISAO" className="question_group">


                <h1 className="spm_casa">VISÃO A criança ...</h1>


                <div className="question">
                    <p>11. Parece incomodada com a luz especialmente luz intensa (pisca,
                        chora ou fecha os olhos)?</p>
                    <SpmRadioAnswer name={"question_11"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>12. Tem dificuldade em encontrar um objeto quando está no meio de
                        outras coisas?</p>
                    <SpmRadioAnswer name={"question_12"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>13. Fecha um olho ou inclina a cabeça para trás quando olha para
                        alguém ou para alguma coisa?</p>
                    <SpmRadioAnswer name={"question_13"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>14. Parece aflita/perturbada num ambiente visual não usual, tal como
                        um quarto luminoso, colorido, mal iluminado?</p>
                    <SpmRadioAnswer name={"question_14"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>15. Tem dificuldade em controlar o movimento dos olhos enquanto
                        segue um objeto (ex. uma bola)?</p>
                    <SpmRadioAnswer name={"question_15"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>16. Tem dificuldade em reconhecer semelhanças ou diferenças entre
                        objetos baseando-se nas suas cores, formas ou
                        tamanhos?</p>
                    <SpmRadioAnswer name={"question_16"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>17. Gosta de ver objetos a girar ou a mover-se, mais do que a
                        maioria das crianças da sua idade?</p>
                    <SpmRadioAnswer name={"question_17"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>18. Anda em direção a objetos ou pessoas como se não estivessem lá?</p>
                    <SpmRadioAnswer name={"question_18"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>19. Gosta de ligar e desligar interruptores repetidamente?</p>
                    <SpmRadioAnswer name={"question_19"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>20. Não gosta de certos tipos de iluminação, tais como o sol
                        intenso, luzes brilhantes, intermitentes ou flurescentes?</p>
                    <SpmRadioAnswer name={"question_20"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>21. Gosta de olhar os objetos em movimento pelo canto do olho?</p>
                    <SpmRadioAnswer name={"question_21"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="resultado">
                    <p>VISÃO = {sumQuestions[questionGroup_V]}</p>
                    <p>% score = {scoreQuestions[questionGroup_V]} % | T-score = {tsQuestions[questionGroup_V]} </p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_V]}/></p>

                </div>

            </div>


            <div id="AUDICAO" className="question_group">

                <h1 className="spm_casa">AUDIÇÃO A criança ...</h1>


                <div className="question">
                    <p>22. Parece incomodada com os sons domésticos comuns, tais como o
                        aspirador, secador de cabelo ou o autoclismo?</p>
                    <SpmRadioAnswer name={"question_22"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>23. Responde negativamente a barulhos altos, fugindo, chorando ou
                        tapando os ouvidos com as mãos?</p>
                    <SpmRadioAnswer name={"question_23"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>24. Parece não ouvir certos sons?</p>
                    <SpmRadioAnswer name={"question_24"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>25. Parece perturbada ou muito interessada por sons usualmente não
                        notados por outras pessoas?</p>
                    <SpmRadioAnswer name={"question_25"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>26. Parece assustada com sons que usualmente não incomodam outras
                        crianças da mesma idade?</p>
                    <SpmRadioAnswer name={"question_26"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>27. Distrai-se facilmente com barulhos de fundo tais como ar
                        condicionado, frigorifico, luz fluorescente ou cortador de
                        relva?</p>
                    <SpmRadioAnswer name={"question_27"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>28. Gosta de causar certos sons repetidamente, tais como descarregar
                        o autoclismo?</p>
                    <SpmRadioAnswer name={"question_28"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>29. Mostra-se aflita/perturbada com sons muito altos e estridentes,
                        tais como assobios, cornetas, flautas ou trompetes?</p>
                    <SpmRadioAnswer name={"question_29"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="resultado">
                    <p>AUDIÇÃO = {sumQuestions[questionGroup_A]}</p>
                    <p>% score = {scoreQuestions[questionGroup_A]} % | T-score = {tsQuestions[questionGroup_A]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_A]}/></p>

                </div>


            </div>


            <div id="TOQUE" className="question_group">


                <h1 className="spm_casa">TOQUE A criança ...</h1>


                <div className="question">
                    <p>30. Afasta-se quando é tocada levemente?</p>
                    <SpmRadioAnswer name={"question_30"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>31. Parece não ter uma perceção normal de ser tocada?</p>
                    <SpmRadioAnswer name={"question_31"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>32. Fica aflita/perturbada com a sensação de roupa nova (lãs,
                        tecidos ásperos, etiquetas)?</p>
                    <SpmRadioAnswer name={"question_32"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>33. Prefere tocar a ser tocada?</p>
                    <SpmRadioAnswer name={"question_33"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>34. Fica aflita/perturbada quando lhe cortam as unhas das mãos ou
                        dos pés?</p>
                    <SpmRadioAnswer name={"question_34"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>35. Parece incomodada quando alguém lhe toca na cara?</p>
                    <SpmRadioAnswer name={"question_35"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>36. Evita tocar ou brincar com digitintas, areia, barro, lama, cola
                        ou outras coisas que sujem?</p>
                    <SpmRadioAnswer name={"question_36"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>37. Tem uma tolerância invulgarmente alta à dor (ex. cai e não chora
                        ou vai contra os objetos e não nota)?</p>
                    <SpmRadioAnswer name={"question_37"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>38. Não gosta de escovar os dentes, mais do que a maioria das
                        crianças da sua idade?</p>
                    <SpmRadioAnswer name={"question_38"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>39. Parece gostar de sensações que podem ser dolorosas como por
                        exemplo atirar-se para o chão ou bater no seu corpo?</p>
                    <SpmRadioAnswer name={"question_39"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>40. Tem dificuldade em encontrar coisas nos bolsos, mala, ou mochila
                        usando apenas o toque (sem a visão)?</p>
                    <SpmRadioAnswer name={"question_40"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="resultado">
                    <p>TOQUE = {sumQuestions[questionGroup_T]}</p>
                    <p>% score = {scoreQuestions[questionGroup_T]} % | T-score = {tsQuestions[questionGroup_T]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_T]}/></p>

                </div>

            </div>


            <div id="GOSTO_E_OLFATO" className="question_group">


                <h1 className="spm_casa">GOSTO E OLFATO A criança ...</h1>


                <div className="question">
                    <p>41. Gosta de provar coisas não comestíveis, tais como cola ou tinta?</p>
                    <SpmRadioAnswer name={"question_41"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>42. Dá-lhe vómitos quando tem à frente uma comida que não aprecia
                        tal como espinafres cozidos?</p>
                    <SpmRadioAnswer name={"question_42"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>43. Gosta de cheirar os objetos não comestíveis e pessoas?</p>
                    <SpmRadioAnswer name={"question_43"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>44. Fica aflita/perturbada com cheiros que as outras crianças não
                        notam?</p>
                    <SpmRadioAnswer name={"question_44"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>45. Parece ignorar ou não notar cheiros fortes a que as outras
                        crianças reagem?</p>
                    <SpmRadioAnswer name={"question_45"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="resultado">
                    <p>GOSTO E OLFATO = {sumQuestions[questionGroup_GO]}</p>
                    <p>% score = {scoreQuestions[questionGroup_GO]} % | T-score = {tsQuestions[questionGroup_GO]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_GO]}/></p>

                </div>


            </div>


            <div id="CONSCIENCIA_CORPORAL" className="question_group">


                <h1 className="spm_casa">CONSCIÊNCIA CORPORAL A criança ...</h1>


                <div className="question">
                    <p>46. Agarra os objetos (lápis ou colher) com tanta força que lhe é
                        difícil usá-los?</p>
                    <SpmRadioAnswer name={"question_46"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>47. Parece procurar atividades tais como empurrar, puxar, arrastar,
                        levantar e saltar?</p>
                    <SpmRadioAnswer name={"question_47"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>48. Parece insegura de como deve baixar ou levantar o corpo durante
                        movimentos tais como sentar ou subir para cima de
                        um banco ou cadeira?</p>
                    <SpmRadioAnswer name={"question_48"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>49. Agarra os objetos (lápis ou colher) tão levemente que lhe é
                        difícil usá-los?</p>
                    <SpmRadioAnswer name={"question_49"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>50. Parece exercer muita pressão nas tarefas tais como andar
                        pesadamente, bater portas, ou carregar demasiado quando
                        utiliza lápis de cor ou de cera?</p>
                    <SpmRadioAnswer name={"question_50"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>51. Salta muitas vezes?</p>
                    <SpmRadioAnswer name={"question_51"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>52. Quando pega num animal agarra-o com muita força?</p>
                    <SpmRadioAnswer name={"question_52"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>53. Choca ou empurra as outras crianças?</p>
                    <SpmRadioAnswer name={"question_53"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>54. Mastiga brinquedos, roupas ou outros objetos mais do que as
                        outras crianças?</p>
                    <SpmRadioAnswer name={"question_54"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>55. Agarra ou empurra os objetos com tanta força que os parte?</p>
                    <SpmRadioAnswer name={"question_55"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="resultado">
                    <p>CONSCIÊNCIA CORPORAL = {sumQuestions[questionGroup_CC]}</p>
                    <p>% score = {scoreQuestions[questionGroup_CC]} % | T-score = {tsQuestions[questionGroup_CC]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_CC]}/></p>

                </div>


            </div>


            <div id="MOVIMENTO_E_EQILIBRIO" className="question_group">


                <h1 className="spm_casa">MOVIMENTO E EQUILIBRIO A criança ...</h1>


                <div className="question">
                    <p>56. Parece ter um medo excessivo do movimento, tal como subir ou
                        descer escadas, andar de baloiço, balancé, escorrega
                        ou outro equipamento dos parques infantis?</p>
                    <SpmRadioAnswer name={"question_56"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>57. Tem um bom equilíbrio?</p>
                    <SpmRadioAnswer name={"question_57"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>58. Evita atividades que exijam equilíbrio tais como andar no lancil
                        do passeio ou pisos irregulares?</p>
                    <SpmRadioAnswer name={"question_58"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>59. Cai da cadeira quando muda de posição?</p>
                    <SpmRadioAnswer name={"question_59"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>60. Não se protege quando cai (pôr as mãos à frente do corpo)?</p>
                    <SpmRadioAnswer name={"question_60"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>61. Parece não ficar tonta quando usualmente os outros ficam?</p>
                    <SpmRadioAnswer name={"question_61"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>62. Gira e rodopia sobre si mesma, mais do que as outras crianças?</p>
                    <SpmRadioAnswer name={"question_62"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>63. Mostra-se aflita/perturbada quando a sua cabeça é inclinada e
                        retirada da posição vertical?</p>
                    <SpmRadioAnswer name={"question_63"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>64. Tem dificuldades de coordenação e parece desajeitada?</p>
                    <SpmRadioAnswer name={"question_64"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>65. Parece ter medo de andar de elevador ou escadas rolantes?</p>
                    <SpmRadioAnswer name={"question_65"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">
                    <p>66. Encosta-se a outras pessoas ou mobílias quando se senta ou se
                        tenta levantar?</p>
                    <SpmRadioAnswer name={"question_66"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="resultado">
                    <p>MOVIMENTO E EQUILIBRIO = {sumQuestions[questionGroup_ME]}</p>
                    <p>% score = {scoreQuestions[questionGroup_ME]} % | T-score = {tsQuestions[questionGroup_ME]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_ME]}/></p>

                </div>

            </div>


            <div id="PLANEAMENTO_MOTOR_E_IDEACAO" className="question_group">


                <h1 className="spm_casa">PLANEAMENTO MOTOR E IDEAÇÃO A criança ...</h1>


                <div className="question">
                    <p>67. Tem um desempenho inconsistente das suas tarefas diárias?</p>
                    <SpmRadioAnswer name={"question_67"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>68. Tem dificuldade em perceber como transportar vários objetos ao
                        mesmo tempo?</p>
                    <SpmRadioAnswer name={"question_68"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>69. Parece confusa sobre como arrumar os materiais e colocá-los nos
                        seus lugares corretos?</p>
                    <SpmRadioAnswer name={"question_69"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>70. Tem dificuldade em desempenhar as tarefas na sequência certa tal
                        como vestir-se ou pôr a mesa?</p>
                    <SpmRadioAnswer name={"question_70"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>71. Tem dificuldade em completar tarefas com muitas fases?</p>
                    <SpmRadioAnswer name={"question_71"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>72. Tem dificuldade em imitar ações demonstradas, tais como jogos de
                        movimento ou canções com movimento?</p>
                    <SpmRadioAnswer name={"question_72"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>73. Tem dificuldade em construir por cópia de um modelo um jogo com
                        legos ou blocos?</p>
                    <SpmRadioAnswer name={"question_73"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>74. Tem dificuldade em ter ideias para jogos ou atividades novas?</p>
                    <SpmRadioAnswer name={"question_74"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>75. Tende a jogar sempre o mesmo jogo, em vez de mudar de atividade
                        quando lhe é dada a oportunidade?</p>
                    <SpmRadioAnswer name={"question_75"} color={"green"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="resultado">
                    <p>PLANEAMENTO MOTOR E IDEAÇÃO= {sumQuestions[questionGroup_PMI]}</p>
                    <p>% score = {scoreQuestions[questionGroup_PMI]} % | T-score = {tsQuestions[questionGroup_PMI]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_PMI]}/></p>

                </div>


            </div>


            <div className="spm_calculate_button">

                <button className="spm_casa" onClick={calculate_spm_casa}>Save SPM</button>

            </div>


        </form>
    );
}







