import Session from "./Session";
import {useEffect, useState} from "react";


import config  from './../../config/config.json';

const api_host = config.api.host
const api_port = config.api.port
//' + api_host + ':' + api_port + '



export default function IndexPage() {
  // const [posts,setPosts] = useState([]);
  // useEffect(() => {
  //   fetch('http://' + api_host + ':' + api_port + '/post').then(response => {
  //     response.json().then(posts => {
  //       setPosts(posts);
  //     });
  //   });
  // }, []);
  // return (
  //   <>
  //     {posts.length > 0 && posts.map(post => (
  //       <Session {...post} />
  //     ))}
  //   </>
  // );
}