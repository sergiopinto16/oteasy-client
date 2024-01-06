import {useContext, useEffect, useState, useRef} from "react";
import {Navigate, useParams} from "react-router-dom";
// import {UserContext} from "../UserContext";
import SpmRadioAnswer from "../../components/SpmRadioAnswer";
import './Spm.css'
import calc_SPMpescola, {
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
} from "./calc/calc_SpmpEscola";
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
import {UserContext} from "../../UserContext";


import config from '../../config/config.json';

const api_host = config.api.host
const spm_type = 3


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


export default function SPMpEscola() {

    const {userInfo, setUserInfo} = useContext(UserContext);
    const {client_id} = useParams();

    if (userInfo?.email === undefined) {
        console.log("Not logged, return to home")
        window.location.replace("/");
    }
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
        sumQuestions[questionGroup_V] = calculate_question_group(11, 20, false)
        sumQuestions[questionGroup_A] = calculate_question_group(21, 30, false)
        sumQuestions[questionGroup_T] = calculate_question_group(31, 40, false)
        sumQuestions[questionGroup_GO] = calculate_question_group(41, 45, false)
        sumQuestions[questionGroup_CC] = calculate_question_group(46, 55, false)
        sumQuestions[questionGroup_ME] = calculate_question_group(56, 65, false)
        sumQuestions[questionGroup_PMI] = calculate_question_group(66, 75, false)

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

    async function calculate_spm_p_escola(ev) {
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

    return (
        <form className="spm_p_escola">


            <div className="button_form_download">
                <button className="spm_p_escola"
                        onClick={() => window.open(require('../../static/SPM/docs/SPM-p_Escola_TUDO_COMPLETO(2-5Anos).pdf'), '_none')}> Donwload
                    Formulário
                </button>
            </div>

            <h1 className="title spm_p_escola">SPM-p ESCOLA</h1>

            <div id="PS" className="question_group">

                <h1 className="spm_p_escola">PARTICIPAÇÃO SOCIAL Este aluno ...</h1>

                <div className="question">
                    <p>1. Brinca voluntariamente com os pares numa variedade de jogos e
                        actividades</p>
                    <SpmRadioAnswer name={"question_1"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>2. Espera pela sua vez</p>
                    <SpmRadioAnswer name={"question_2"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>3. Participa apropriadamente no tempo do circulo</p>
                    <SpmRadioAnswer name={"question_3"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>4. Transita suavemente para novas actividades</p>
                    <SpmRadioAnswer name={"question_4"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>5. Entra para as brincadeiras dos pares sem interromper a
                        continuidade da actividade</p>
                    <SpmRadioAnswer name={"question_5"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>6. Segue as regras e as rotinas da sala</p>
                    <SpmRadioAnswer name={"question_6"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>7. Partilha os brinquedos e os materiais da sala quando lhe é pedido</p>
                    <SpmRadioAnswer name={"question_7"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>8. Trabalha cooperativamente com os pares para atingir um objectivo
                        comum (ex: durante a limpeza, construções)</p>
                    <SpmRadioAnswer name={"question_8"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>9. Interage com os pares durante o jogo simbólico</p>
                    <SpmRadioAnswer name={"question_9"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>10. Resolve os conflitos dos pares sem a intervenção da Educadora</p>
                    <SpmRadioAnswer name={"question_10"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="resultado">
                    <p>PARTICIPAÇÃO SOCIAL = {sumQuestions[questionGroup_PS]}</p>
                    <p>% score = {scoreQuestions[questionGroup_PS]} % | T-score = {tsQuestions[questionGroup_PS]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_PS]}/></p>

                </div>

            </div>


            <div id="VISAO" className="question_group">


                <h1 className="spm_p_escola">VISÃO Este aluno ...</h1>


                <div className="question">
                    <p>11. Pisca os olhos, tapa os olhos ou queixa-se da luz da sala ou da
                        luz do sol</p>
                    <SpmRadioAnswer name={"question_11"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>12. Distrai-se com objetos próximos ou pessoas (imagens, figuras nas
                        paredes, janelas, outras crianças, etc)</p>
                    <SpmRadioAnswer name={"question_12"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>13. Tem dificuldade em localizar objectos ou pessoas ao olhar ao
                        redor da sala ou do espaço de brincadeira</p>
                    <SpmRadioAnswer name={"question_13"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>14. Tem dificuldade em encontrar um objeto pretendido entre vários
                        espalhados na secretária ou na mesa</p>
                    <SpmRadioAnswer name={"question_14"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>15. Olha para a sala ou para os pares enquanto a professora está a
                        falar
                    </p>
                    <SpmRadioAnswer name={"question_15"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>16. Tem dificuldade em identificar objetos pela cor ou pela forma</p>
                    <SpmRadioAnswer name={"question_16"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>17. Vai de encontro aos outros que estão a brincar no espaço de jogo</p>
                    <SpmRadioAnswer name={"question_17"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>18. Fixa intensamente pessoas ou objetos</p>
                    <SpmRadioAnswer name={"question_18"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>19. Fixa intensamente pessoas ou objetos</p>
                    <SpmRadioAnswer name={"question_19"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>20. Gosta de observar objectos a mover pelo canto do olho</p>
                    <SpmRadioAnswer name={"question_20"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="resultado">
                    <p>VISÃO = {sumQuestions[questionGroup_V]}</p>
                    <p>% score = {scoreQuestions[questionGroup_V]} % | T-score = {tsQuestions[questionGroup_V]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_V]}/></p>

                </div>

            </div>


            <div id="AUDICAO" className="question_group">

                <h1 className="spm_p_escola">AUDIÇÃO Este aluno ...</h1>


                <div className="question">
                    <p>21. Mostra stresse perante altos sons (blocos que caem, gritos ou
                        choro de outras crianças,
                        corredores barulhentos, autoclismo, etc)</p>
                    <SpmRadioAnswer name={"question_21"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="question">
                    <p>22. Mostra stress quando os colegas cantam ou usam instrumentos
                        musicais</p>
                    <SpmRadioAnswer name={"question_22"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>23. Permanece ignorar novas vozes ou novos sons na sala</p>
                    <SpmRadioAnswer name={"question_23"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/>
                </div>

                <div className="question">
                    <p>24. Permanece ignorar novas vozes ou novos sons na sala</p>
                    <SpmRadioAnswer name={"question_24"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>25. Faz barulhos, grunhidos, canta ou grita durante momentos de aula
                        silenciosos</p>
                    <SpmRadioAnswer name={"question_25"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>26. Gosta de provocar certos sons repetidamente (ex: puxar várias
                        vezes o autoclismo)</p>
                    <SpmRadioAnswer name={"question_26"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>27. Parece não ter consciência de sons que são notados pelos outros</p>
                    <SpmRadioAnswer name={"question_27"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>28. Tem dificuldade em estar atento quando a sala de aula é
                        barulhenta</p>
                    <SpmRadioAnswer name={"question_28"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>29. Parece incapaz de seguir direções verbais</p>
                    <SpmRadioAnswer name={"question_29"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">
                    <p>30. Aborrece-se com ou comenta barulhos de fundo constantes que
                        outras crianças ignoram (ex: ventoinha, tic-tac do relógio)</p>
                    <SpmRadioAnswer name={"question_30"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="resultado">
                    <p>AUDIÇÃO = {sumQuestions[questionGroup_A]}</p>
                    <p>% score = {scoreQuestions[questionGroup_A]} % | T-score = {tsQuestions[questionGroup_A]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_A]}/></p>

                </div>
            </div>


            <div id="TOQUE" className="question_group">


                <h1 className="spm_p_escola">TOQUE Este aluno ...</h1>


                <div className="question">

                    <p>31. Evita ser tocado pelos outros (ex: recusa ser tocado ou
                        abraçado, recusa participar na roda de mãos dadas)</p>
                    <SpmRadioAnswer name={"question_31"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>32. Mostra stresse quando as mãos ou a cara estão sujas (ex: cola,
                        tintas nos dedos, comida, etc)</p>
                    <SpmRadioAnswer name={"question_32"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>33. Mostra stresse quando lava as mãos quer em água quente quer em
                        água fria</p>
                    <SpmRadioAnswer name={"question_33"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>34. Fica stressado com o toque acidental dos colegas (Sacode onde
                        foi tocado ou afasta-se dos colegas)</p>
                    <SpmRadioAnswer name={"question_34"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>35. Não limpa a saliva ou restos de comida na cara</p>
                    <SpmRadioAnswer name={"question_35"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>36. Fica stressado ao tocar em certas texturas (materias da sala,
                        utensílios, equipamentos desportivos, etc)</p>
                    <SpmRadioAnswer name={"question_36"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>37. Recusa vestir outras roupas por cima (ex: batas, kispos)</p>
                    <SpmRadioAnswer name={"question_37"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>38. Tem alta tolerância à dor (ex: mostra uma ligeira impressão ou
                        nem repara nos cortes
                        e nódoas negras que tem e que as demais crianças sentem dor)</p>
                    <SpmRadioAnswer name={"question_38"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>39. Parece não ter consciência da necessidade de usar a sanita (quer
                        tenha xixi ou cócó)</p>
                    <SpmRadioAnswer name={"question_39"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>40. Evita tocar ou brincar com digitintas, plasticinas, pastas de
                        modelar, areias, colas ou outros materiais)</p>
                    <SpmRadioAnswer name={"question_40"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="resultado">
                    <p>TOQUE = {sumQuestions[questionGroup_T]}</p>
                    <p>% score = {scoreQuestions[questionGroup_T]} % | T-score = {tsQuestions[questionGroup_T]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_T]}/></p>

                </div>


            </div>


            <div id="GOSTO_E_OLFATO" className="question_group">


                <h1 className="spm_p_escola">GOSTO E OLFATO Este aluno ...</h1>


                <div className="question">
                    <p>41. Lambe ou morde objectos (equipamentos do espaço onde brinca,
                        mobílias, brinquedos, etc)</p>
                    <SpmRadioAnswer name={"question_41"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>42. Parece indiferente perante odores fortes ou pouco vulgares (ex:
                        cola, tinta, marcadores etc)</p>
                    <SpmRadioAnswer name={"question_42"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>43. Fica stressado perante o cheiros da sopa, perfume, laca do
                        cabelo ou loções do corpo</p>
                    <SpmRadioAnswer name={"question_43"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>44. Fica stressado com o sabor da comida comparativamente às outras
                        crianças da mesma idade</p>
                    <SpmRadioAnswer name={"question_44"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>45. Recusa experimentar novas comidas</p>
                    <SpmRadioAnswer name={"question_45"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="resultado">
                    <p>GOSTO E OLFATO = {sumQuestions[questionGroup_GO]}</p>
                    <p>% score = {scoreQuestions[questionGroup_GO]} % | T-score = {tsQuestions[questionGroup_GO]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_GO]}/></p>

                </div>


            </div>


            <div id="CONSCIENCIA_CORPORAL" className="question_group">


                <h1 className="spm_p_escola">CONSCIÊNCIA CORPORAL Este aluno ...</h1>


                <div className="question">
                    <p>46. Move a cadeira bruscamente (empurra a cadeira para baixo da mesa
                        bruscamente ou afasta-a com muita força)</p>
                    <SpmRadioAnswer name={"question_46"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>47. Carrega no papel com muita força e parte com facilidade pontas
                        dos lápis, crayons e batons de cola</p>
                    <SpmRadioAnswer name={"question_47"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>48. Salta constantemente; procura saltar para o chão de locais altos</p>
                    <SpmRadioAnswer name={"question_48"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>49. Fecha ou abre as portas com excessiva força</p>
                    <SpmRadioAnswer name={"question_49"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>50. Usa demasiada força quando brinca com os objectos
                        (ex: dá pancadas nos instrumentos musicais ou esbarra blocos de
                        construção uns contra os outros)</p>
                    <SpmRadioAnswer name={"question_50"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>51. Vai de encontro aos colegas com frequência (ex: enquanto está na
                        fila ou enquanto se move no espaço onde brinca)</p>
                    <SpmRadioAnswer name={"question_51"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>52. Mastiga ou morde roupa, lápis, crayons, ou outros materiais da
                        sala</p>
                    <SpmRadioAnswer name={"question_52"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>53. Transporta comida ou conteúdos de bebida bruscamente (pode
                        amassar, partir ou deixar cair o conteúdo que transporta)</p>
                    <SpmRadioAnswer name={"question_53"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>54. Derruba as construções que as outras crianças fizeram (ex:
                        torres de blocos, esculturas, estradas, carruagens)</p>
                    <SpmRadioAnswer name={"question_54"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>55. Quando está a recortar, fecha a tesoura com demasiada força</p>
                    <SpmRadioAnswer name={"question_55"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="resultado">
                    <p>CONSCIÊNCIA CORPORAL = {sumQuestions[questionGroup_CC]}</p>
                    <p>% score = {scoreQuestions[questionGroup_CC]} % | T-score = {tsQuestions[questionGroup_CC]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_CC]}/></p>
                </div>

            </div>


            <div id="MOVIMENTO_E_EQILIBRIO" className="question_group">


                <h1 className="spm_p_escola">MOVIMENTO E EQUILIBRIO Este aluno ...</h1>


                <div className="question">
                    <p>56. Rodopia ou gira à volta excessivamente</p>
                    <SpmRadioAnswer name={"question_56"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>57. Encosta-se às paredes, móveis ou pessoas como forma de apoio
                        enquanto está de pé</p>
                    <SpmRadioAnswer name={"question_57"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>58. Escorrega, deita-se sobre secretária/mesa ou segura a cabeça com
                        as mãos
                        enquanto está sentado à mesa de trabalho</p>
                    <SpmRadioAnswer name={"question_58"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>59. Tem um medo excessivo de actividades movimentadas tais como
                        andar de baloiço, cavalos de balancé, escorregas
                        ou outros equipamentos de parque infantil</p>
                    <SpmRadioAnswer name={"question_59"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>60. Prefere actividades movimentadas</p>
                    <SpmRadioAnswer name={"question_60"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>61. Fica desorientada ou mostra receio quando se baixa para apanhar
                        objectos do chão</p>
                    <SpmRadioAnswer name={"question_61"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>62. Tem dificuldade em recompor-se quando falha numa actividade</p>
                    <SpmRadioAnswer name={"question_62"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>63. Fica stressada quando está em equipamentos altos</p>
                    <SpmRadioAnswer name={"question_63"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>64. Tem uma coordenação pobre</p>
                    <SpmRadioAnswer name={"question_64"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>65. Tem dificuldade em acompanhar ritmos (ex: bater palmas ou pés
                        segundo o ritmo)</p>
                    <SpmRadioAnswer name={"question_65"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="resultado">
                    <p>MOVIMENTO E EQUILIBRIO = {sumQuestions[questionGroup_ME]}</p>
                    <p>% score = {scoreQuestions[questionGroup_ME]} % | T-score = {tsQuestions[questionGroup_ME]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_ME]}/></p>

                </div>


            </div>


            <div id="PLANEAMENTO_MOTOR_E_IDEACAO" className="question_group">


                <h1 className="spm_p_escola">PLANEAMENTO MOTOR E IDEAÇÃO Este aluno ...</h1>

                <div className="question">
                    <p>66. Fica "preso" numa actividade à exclusão de outras</p>
                    <SpmRadioAnswer name={"question_66"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>


                <div className="question">
                    <p>67. Tem dificuldade em introduzir novas ideias durante as
                        actividades</p>
                    <SpmRadioAnswer name={"question_67"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>68. Brinca de forma repetida durante o jogo livre; não modifica a
                        actividade de forma a aumentar o desafio</p>
                    <SpmRadioAnswer name={"question_68"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>69. Necessita de adereços reais para se envolver no jogo funcional
                        (ex: brincar com telefone)</p>
                    <SpmRadioAnswer name={"question_69"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>70. Tem dificuldade em imitar correctamente o que foi demonstrado
                        previamente
                        (ex: jogos com movimento, canções com gestos)</p>
                    <SpmRadioAnswer name={"question_70"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>71. Brinca com os seus próprios jogos, evita imitar os outros</p>
                    <SpmRadioAnswer name={"question_71"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>72. Tem dificuldade em copiar as construções com blocos do adulto ou
                        de outra criança</p>
                    <SpmRadioAnswer name={"question_72"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>73. Tem dificuldade em usar coordenadamente as duas mãos para
                        cortar, desenhar e pintar
                        (i.e., uma mão segura no papel enquanto a outra trabalha)</p>
                    <SpmRadioAnswer name={"question_73"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>74. Não consegue completar tarefas com multiplos passos</p>
                    <SpmRadioAnswer name={"question_74"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="question">

                    <p>75. Falha no desempenho sequencial das actividades da vida diária
                        (ex: guardar os materiais
                        na mochila, deitar os restos de comida no lixo, vestir o casaco
                        antes de se ir embora)</p>
                    <SpmRadioAnswer name={"question_75"} color={"red"} callbackValueRadio={getRadioValue}
                                    text={SpmRadioAnswerText}/></div>

                <div className="resultado">
                    <p>PLANEAMENTO MOTOR E IDEAÇÃO= {sumQuestions[questionGroup_PMI]}</p>
                    <p>% score = {scoreQuestions[questionGroup_PMI]} % | T-score = {tsQuestions[questionGroup_PMI]}</p>
                    <p><TextClassificacaoNivel classificacao={classificacaoQuestions[questionGroup_PMI]}/></p>
                </div>


            </div>

            <div className="spm_calculate_button">

                <button className="spm_p_escola" onClick={calculate_spm_p_escola}>Save SPM</button>


            </div>


        </form>
    );
}







