import React, {useState} from "react";
import config from "../../config/config.json";
import axios from 'axios';
import {useParams} from "react-router-dom";

const api_host = config.api.host;


export default function FileUploader() {

    // const [file, setFile] = useState<File | null>(null);
    const [files, setFiles] = useState(null);
    //const [status, setStatus] = useState< "initial" | "uploading" | "success" | "fail" >("initial");
    const [status, setStatus] = useState("initial");
    const {client_id} = useParams()


    const handleFileChange = (e) => {
        if (e.target.files) {
            setStatus("initial");
            setFiles(e.target.files);
        }
    };

    const handleUpload = async () => {
        if (files) {
            setStatus("uploading");
            console.log("Uploading file...");

            const formData = new FormData();
            //formData.append("file", file);
            [...files].forEach((file) => {
                formData.append('files', file);
            });
            console.log("client_id = ", client_id);
            formData.append('clientID',client_id);

            try {
                const response = await axios.post(api_host + '/api/upload', formData);

                if (response.status === 200) {
                    const data = await response.data;
                    console.log(data);
                    setStatus("success");

                }

            } catch (error) {
                console.error(error)
                setStatus("fail");

            }
        }
    };

    return (
        <>
            <div className="input-group">
                <label htmlFor="file" className="sr-only">
                    Choose files
                </label>
                <input id="file" type="file" multiple onChange={handleFileChange} />
            </div>

            {files &&
                [...files].map((file, index) => (
                    <section key={file.name}>
                        File number {index + 1} details:
                        <ul>
                            <li>Name: {file.name}</li>
                            <li>Type: {file.type}</li>
                            <li>Size: {file.size} bytes</li>
                        </ul>
                    </section>
                ))}

            {files && (
                <button onClick={handleUpload} className="submit">
                    Upload {files.length > 1 ? "files" : "a file"}
                </button>
            )}

            <br></br>
            <Result status={status}/>


        </>
    );
};

const Result = ({status}: { status: string }) => {
    if (status === "success") {
        return <p>✅ File uploaded successfully!</p>;
    } else if (status === "fail") {
        return <p>❌ File upload failed!</p>;
    } else if (status === "uploading") {
        return <p>⏳ Uploading selected file...</p>;
    } else {
        return null;
    }
};