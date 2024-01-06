import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import './ClientReports.css'

export default function ClientReports({ _id, card_id, name, email, bird_year, bird_month, bird_day, parent_name, contact_number, doctor, createdAt }) {

  return (

    <div className="client_report">

      <div className="content">
        <h1>{card_id}</h1>

        <div className="input">
          <label>ID: </label>
          <p>{_id}</p>
        </div>
        <div className="input">
          <label>Time: </label>
          <p>{createdAt}</p>
        </div>


        <div className="input">
          <label>Name:</label>
          <p>{name}</p>
        </div>

        <div className="input">
          <label>Email:</label>
          <p>{email}</p>
        </div>

        <div className="input">
          <label>Doctor:</label>
          <p>{doctor}</p>
        </div>


      </div>

    </div>
  );
}