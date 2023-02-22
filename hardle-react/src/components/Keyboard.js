export default function Keyboard() {
  return (
    <div className="keyboard">
        <Line letters={qwerty} />
        <Line letters={asdf} />
        <Line letters={zxcv} />
    </div>
  );
}


const qwerty = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]; // top row
const asdf = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]; // middle row
const zxcv = ["Z", "X", "C", "V", "B", "N", "M"]; // bottom row

function Line(props) {
    return (
        <div className="keyboard--line">
            {props.letters.map((letter) => <button className="keyboard--key">{letter}</button>)}
        </div>
    );
}

