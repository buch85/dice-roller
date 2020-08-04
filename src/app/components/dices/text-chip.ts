export class TextChip {
    text: string | number;

    constructor(text: string | number) {
        this.text = text;
    }

    getText(): string {
        return `${this.text}`;
    }
}
