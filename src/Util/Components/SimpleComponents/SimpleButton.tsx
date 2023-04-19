import {e} from "Util/Helper/DomEventHelper";
import {ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent, MouseEventHandler, ReactNode, useState} from "react";
import {CircularProgress} from "@mui/material";
import Styles from "Util/Components/SimpleComponents/SimpleComponents.module.scss"
import {Tooltip} from "Util/Components/SimpleComponents/SimpleTooltip";

type TextButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {icon?: undefined}
type IconButtonProps = Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "children"> & {icon: string | ReactNode, children?: undefined}

type ButtonProps = Omit<TextButtonProps | IconButtonProps, "onClick"> & {
    onClick?: (e: MouseEvent<unknown>)=>void | Promise<unknown>
    tooltip?: string | ReactNode
}

export function Button({onClick, children, className, disabled, icon, tooltip, ...props}: ButtonProps) {
    let [loading, setLoading] = useState(false)
    let click = e(async (ev)=>{
        if(!onClick) return
        let r = onClick(ev)
        if(r instanceof Promise) {
            setLoading(true)
            await r
            setLoading(false)
        }
    })
    let isDisabled = disabled || loading
    if(icon) {
        return <Tooltip text={tooltip} wrapSpan>
            <a className={`${className} ${Styles.IconButton}`} onClick={disabled ? undefined : click}>
                {typeof icon === "string" ? <i className={`${icon} ${isDisabled ? Styles.disabled : ''}`}  /> : icon }
            </a>
        </Tooltip>
    } else {
        return <Tooltip text={tooltip} wrapSpan>
            <button className={className} onClick={e(onClick)} disabled={isDisabled} {...props}>
                {children}
                {loading && <CircularProgress />}
            </button>
        </Tooltip>
    }
}

export function TwoPressButton({onClick, children, className, ...props}: ButtonProps) {
    let [pressedOnce, setPressedOnce] = useState(false)
    let click = (ev)=>{
        if(!pressedOnce) {
            setPressedOnce(true)
            return
        }
        if(onClick) onClick(ev)
    }
    return <Button onClick={click} className={pressedOnce ? Styles.TwoClickClicked : undefined} {...props}>
        {children}
    </Button>
}