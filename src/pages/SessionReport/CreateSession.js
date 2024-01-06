import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import Editor from "../../Editor";


import config from './../../config/config.json';

const api_host = config.api.host
//' + api_host + ':' + api_port + '

export default function CreateSession() {


    const [date, setDate] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');

    const [redirect, setRedirect] = useState(false);
    const [client, setClient] = useState('')
    const {client_id} = useParams()

    async function createNewPost(ev) {
        const data = new FormData();
        data.set('date', date);
        data.set('summary', summary);
        data.set('content', content);

        //add utente
        //add doctor
        ev.preventDefault();
        const response = await fetch(api_host + '/api/sessionReport/add', {
            method: 'POST',
            body: JSON.stringify({date, summary, content, client_id}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        } else {

            alert('error adding to db - ' + response);
        }
    }

    if (redirect) {
        //TODO - Redirect to client page
        return <Navigate to={'/'}/>
    }
    return (
        <form onSubmit={createNewPost}>
            <input type="date"
                   placeholder={'Date'}
                   value={date}
                   onChange={ev => setDate(ev.target.value)}/>
            <Editor name="Objetivos da sessão" value={summary} onChange={setSummary}/>
            <Editor name="Observações" value={content} onChange={setContent}/>
            <button style={{marginTop: 20}}>Create session report</button>
        </form>
    );
}