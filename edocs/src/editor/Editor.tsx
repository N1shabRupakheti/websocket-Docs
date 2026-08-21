import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Moon, Sun } from "lucide-react";

interface TextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    minRows?: number;
}

export const TextEditor: React.FC<TextEditorProps> = ({
    value = "",
    onChange,
    placeholder = "Write your thoughts...",
    minRows = 18,
}) => {

    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        const stored = localStorage.getItem("editor-theme");
        if (stored === "dark") return true;
        if (stored === "light") return false;
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Auto-resize textarea height to fit content dynamically
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e.target.value);
    };

    // Wrap highlighted text or drop a placeholder
    const insertFormatting = (prefix: string, suffix: string = prefix) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const replacement = `${prefix}${selectedText || "text"}${suffix}`;

        const newContent =
            value.substring(0, start) + replacement + value.substring(end);

        onChange?.(newContent);

        requestAnimationFrame(() => {
            textarea.focus();
            const cursorOffset = selectedText ? replacement.length : prefix.length;
            textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
        });
    };

    // Handle Tab key indentation
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const newContent =
                value.substring(0, start) + "  " + value.substring(end);

            onChange?.(newContent);

            requestAnimationFrame(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 2;
            });
        }
    };

    const charCount = value.length;
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            localStorage.setItem("editor-theme", next ? "dark" : "light");
            return next;
        });
    };

    return (
        <div className={`${isDark ? "dark" : ""} w-full max-w-5xl mx-auto flex flex-col flex-1 rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 transition-colors`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50/75 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
                <button
                    type="button"
                    onClick={() => insertFormatting("**")}
                    title="Bold"
                    className="h-8 w-8 rounded font-bold text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 focus:outline-none dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => insertFormatting("*")}
                    title="Italic"
                    className="h-8 w-8 rounded italic font-serif text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 focus:outline-none dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => insertFormatting("~~")}
                    title="Strikethrough"
                    className="h-8 w-8 rounded text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 focus:outline-none dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition line-through text-xs font-semibold"
                >
                    S
                </button>
                <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />
                <button
                    type="button"
                    onClick={() => insertFormatting("`")}
                    title="Inline Code"
                    className="h-8 px-2 rounded font-mono text-xs text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 focus:outline-none dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition"
                >
                    &lt;/&gt;
                </button>
                <button
                    type="button"
                    onClick={() => insertFormatting("- ", "")}
                    title="Bullet List"
                    className="h-8 px-2 rounded text-xs font-medium text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 focus:outline-none dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition"
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() => insertFormatting("> ", "")}
                    title="Quote"
                    className="h-8 px-2 rounded text-xs font-medium text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 focus:outline-none dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition"
                >
                    Quote
                </button>
                <button
                    type="button"
                    onClick={toggleTheme}
                    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    className="ml-auto h-8 w-8 inline-flex items-center justify-center rounded text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 focus:outline-none dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition"
                >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>

            {/* Editor Input Area */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={minRows}
                className="w-full min-h-112 resize-none border-0 bg-transparent p-6 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 dark:text-zinc-100 dark:placeholder:text-zinc-500 text-base leading-relaxed"
            />

            {/* Status Bar */}
            <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-0.5 text-[10px] leading-none text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                <span className="italic">Markdown supported</span>
                <div className="flex gap-3">
                    <span>{wordCount} words</span>
                    <span>{charCount} chars</span>
                </div>
            </div>
        </div>
    );
};

export default TextEditor;