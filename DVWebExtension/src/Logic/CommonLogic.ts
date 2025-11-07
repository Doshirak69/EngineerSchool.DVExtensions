import { formatDateTime } from "@docsvision/webclient/System/DateTimeUtils";

export class CommonLogic {

    public parseDate(val: unknown): Date | null {
        if (val == null) return null;
        if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
        try {
            const d = new Date(val as any);
            return isNaN(d.getTime()) ? null : d;
        } catch {
            return null;
        }
    }
    
    public formatDate(date: Date | null | undefined): string {
        return date instanceof Date && !isNaN(date.getTime()) ? formatDateTime(date) : "-";
    }

    public formatText(val: unknown): string {
        if (val == null) return "—";  
        const s = String(val).trim();
        return s.length ? s : "—";      
    }

    public isBlank(value: string): boolean {
        return value.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, "").length === 0;
    }

    public hasLeadingWhitespace(value: string): boolean {
        return /^[\s\u00A0]/.test(value);
    }

    public htmlToPlainText(input: unknown): string {
        if (input == null) return "";
        let s = String(input);

        // Переводы строк
        s = s
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p\s*>/gi, "\n");

        // Удаление тегов
        s = s.replace(/<[^>]+>/g, "");

        // Декодирование
        s = s
            .replace(/&nbsp;/gi, " ")
            .replace(/&amp;/gi, "&")
            .replace(/&quot;/gi, '"')
            .replace(/&#39;/gi, "'")
            .replace(/&lt;/gi, "<")
            .replace(/&gt;/gi, ">");

        // Нормализация пробелов/переносов
        s = s.replace(/\u00A0/g, " ");      
        s = s.replace(/\r\n?/g, "\n");      
        s = s.replace(/\n{3,}/g, "\n\n");
        return s.trim();
    }
}