"use client";

import { useCallback, useEffect, useRef, type TextareaHTMLAttributes } from "react";

type AutoResizeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    minRows?: number;
};

export function AutoResizeTextarea({
    minRows = 4,
    value,
    onChange,
    className = "",
    ...props
}: AutoResizeTextareaProps) {
    const ref = useRef<HTMLTextAreaElement>(null);

    const resize = useCallback(() => {
        const el = ref.current;
        if (!el) return;

        el.style.height = "auto";

        const style = window.getComputedStyle(el);
        const lineHeight = parseFloat(style.lineHeight) || 20;
        const padding =
            parseFloat(style.paddingTop) +
            parseFloat(style.paddingBottom) +
            parseFloat(style.borderTopWidth) +
            parseFloat(style.borderBottomWidth);
        const minHeight = lineHeight * minRows + padding;

        el.style.height = `${Math.max(el.scrollHeight, minHeight)}px`;
    }, [minRows]);

    useEffect(() => {
        resize();
    }, [value, resize]);

    return (
        <textarea
            ref={ref}
            rows={minRows}
            value={value}
            onChange={(e) => {
                onChange?.(e);
                resize();
            }}
            className={`resize-none overflow-hidden ${className}`}
            {...props}
        />
    );
}
