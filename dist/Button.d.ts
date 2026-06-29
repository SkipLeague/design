import type { ButtonHTMLAttributes } from "react";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** "primary" = brand-green fill (default); "secondary" = white with a border. */
    variant?: "primary" | "secondary";
}
/** The standard SkipLeague button. Token-driven; matches the apps' primary action. */
export declare function Button({ variant, style, disabled, ...props }: ButtonProps): import("react").JSX.Element;
