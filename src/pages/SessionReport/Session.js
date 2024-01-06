import {formatISO9075} from "date-fns";
import {Link} from "react-router-dom";



import config  from './../../config/config.json';

const api_host = config.api.host
//' + api_host + ':' + api_port + '


export default function Session({_id,date,summary,content,createdAt,author}) {

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={api_host + '/'+cover} alt=""/>
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}