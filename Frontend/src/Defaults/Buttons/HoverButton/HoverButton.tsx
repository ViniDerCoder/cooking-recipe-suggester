import '../../../ColorScheme.css'
import './HoverButton.css'

export default function HoverButton(props: { text: string, onClick: () => void, sx?: React.ButtonHTMLAttributes<HTMLButtonElement>}) {
    return (
        <button className='hover-button' onClick={props.onClick} {...props.sx}>
            {props.text}
        </button>
    );
}