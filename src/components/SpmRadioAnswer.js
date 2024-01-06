import { UserContext } from "../UserContext";
import './style/SpmRadioAnswer.css';
import { RadioGroup, RadioButton } from 'react-radio-buttons';





export default function SpmRadioAnswer({ name, color, callbackValueRadio, text }) {

  const isMobile = window.innerWidth <= 600;


  // console.log(text)

  let nunca = text[0]
  let ocasionalmente = text[2]
  let frequentemente = text[4]
  let sempre = text[6]


  if (isMobile) {

    nunca = text[1]
    ocasionalmente = text[3]
    frequentemente = text[5]
    sempre = text[7]
  }


  return (

    <div id="radio_checkbox">

      <RadioGroup horizontal onChange={(value) => callbackValueRadio(name, value)} >
        <RadioButton value="1" rootColor={'gray'} pointColor={color} >
          {/* Nunca */}{nunca}
        </RadioButton>
        <RadioButton value="2" rootColor={'gray'} pointColor={color}  >
          {/* Ocasionalmente */}{ocasionalmente}
        </RadioButton>
        <RadioButton value="3" rootColor={'gray'} pointColor={color} >
          {/* Frequentemente */}{frequentemente}
        </RadioButton>
        <RadioButton value="4" rootColor={'gray'} pointColor={color} >
          {/* Sempre */}{sempre}
        </RadioButton>
        {/* </ReversedRadioButton> */}
      </RadioGroup>


    </div>

  );
}
