import type { InputHTMLAttributes, ReactNode } from "react";
/** A labeled form row: a label, the control (children), and an optional hint. */
export declare function Field({ label, hint, children, }: {
    label: string;
    hint?: ReactNode;
    children: ReactNode;
}): import("react").JSX.Element;
/** A styled text input. */
export declare function Input({ style, disabled, ...props }: InputHTMLAttributes<HTMLInputElement>): import("react").JSX.Element;
