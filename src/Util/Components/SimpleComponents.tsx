import {e} from "Util/Helper/DomEventHelper";
import {ButtonHTMLAttributes, DetailedHTMLProps} from "react";

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export function Button({onClick, children, ...props}: ButtonProps) {
    return <button onClick={e(onClick)} {...props}>
        {children}
    </button>
}