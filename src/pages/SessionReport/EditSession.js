import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../../Editor";



import config  from './../../config/config.json';

const api_host = config.api.host
//' + api_host + ':' + api_port + '


export default function EditSession() {
  const {id} = useParams();
  const [date,setDate] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    fetch(api_host + '/sessionInfo/'+id)
      .then(response => {
        response.json().then(sessionInfo => {
          setDate(sessionInfo.date);
          setContent(sessionInfo.content);
          setSummary(sessionInfo.summary);
        });
      });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('date', date);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);

    const response = await fetch(api_host + '/post', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form onSubmit={updatePost}>
      <input type="date"
             placeholder={'Date'}
             value={date}
             onChange={ev => setDate(ev.target.value)} />
      <Editor name="Summary" onChange={setSummary()} value={summary} />
      <Editor name="Content" onChange={setContent} value={content} />

      <button style={{marginTop: 20}}>Update post</button>
    </form>
  );
}