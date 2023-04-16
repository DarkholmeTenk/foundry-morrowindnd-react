import {e} from "Util/Helper/DomEventHelper";
import {ButtonHTMLAttributes, DetailedHTMLProps, ReactNode, useState} from "react";
import {CircularProgress} from "@mui/material";
import Styles from "./SimpleComponents.module.scss"

type TextButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {icon?: undefined}
type IconButtonProps = Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "children"> & {icon: string | ReactNode, children?: undefined}

type ButtonProps = Omit<TextButtonProps | IconButtonProps, "onClick"> & {
    onClick?: ()=>void | Promise<unknown>
    tooltip?: string
}

export function Button({onClick, children, className, disabled, icon, tooltip, ...props}: ButtonProps) {
    let [loading, setLoading] = useState(false)
    let click = e(async ()=>{
        if(!onClick) return
        let r = onClick()
        if(r instanceof Promise) {
            setLoading(true)
            await r
            setLoading(false)
        }
    })
    let isDisabled = disabled || loading
    if(icon) {
        return <a className={`${className} ${Styles.IconButton}`} onClick={click} data-tooltip={tooltip}>
            {typeof icon === "string" ? <i className={`${icon} ${isDisabled ? Styles.disabled : ''}`}  /> : icon }
        </a>
    } else {
        return <button className={className} onClick={e(onClick)} disabled={isDisabled} {...props}>
            {children}
            {loading && <CircularProgress />}
        </button>
    }
}

export function TwoPressButton({onClick, children, className, ...props}: ButtonProps) {
    let [pressedOnce, setPressedOnce] = useState(false)
    let click = ()=>{
        if(!pressedOnce) {
            setPressedOnce(true)
            return
        }
        if(onClick) onClick()
    }
    return <Button onClick={click} className={pressedOnce ? Styles.TwoClickClicked : undefined} {...props}>
        {children}
    </Button>
}