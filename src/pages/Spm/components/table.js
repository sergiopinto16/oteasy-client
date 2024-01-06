import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useContext, useEffect, useState } from "react";



export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const classificacao_nivel = ['Típica (40 - 59)', 'Disfunção Provável (60 - 69)', 'Disfunção Estabelecida (70 - 80)'];

function textClassificacaoNivel(classificacao) {
    return classificacao_nivel[classificacao-1]
}


export default function TextClassificacaoNivel(classificacao) {

    return  textClassificacaoNivel(classificacao.classificacao)

}

export function createData(name, pontuacao, classificacao) {
    const comentario = textClassificacaoNivel(classificacao)
    return { name, pontuacao, comentario }
}



let rows = [
    createData('Participação Social', 0, 0),
    createData('Visão', 0, 0),
    createData('Audição', 0, 0),
    createData('Toque', 0, 0),
    createData('Gosto e Olfato', 0, 0),
    createData('Consciência Corporal', 0, 0),
    createData('Movimento e Equilibrio', 0, 0),
    createData('Planeamento Motor e Ideação', 0, 0),
    createData('TOTAL', 0, 0)
];



export function CustomizedTables(scoreQuestions, classificacaoQuestions) {


    //TODO use useEfect to update values instantyli
    rows = [
        createData('Participação Social', scoreQuestions[0], classificacaoQuestions[0]),
        createData('Visão', scoreQuestions[1], classificacaoQuestions[1]),
        createData('Audição', scoreQuestions[2], classificacaoQuestions[2]),
        createData('Toque', scoreQuestions[3], classificacaoQuestions[3]),
        createData('Gosto e Olfato', scoreQuestions[4], classificacaoQuestions[4]),
        createData('Consciência Corporal', scoreQuestions[5], classificacaoQuestions[5]),
        createData('Movimento e Equilibrio', scoreQuestions[6], classificacaoQuestions[6]),
        createData('Planeamento Motor e Ideação', scoreQuestions[7], classificacaoQuestions[7]),
        createData('TOTAL', scoreQuestions[8], classificacaoQuestions[8]),
    ];


    console.log(rows)



    //return 
    return (
        <div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
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
    )



}