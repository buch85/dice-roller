import {TextChip} from './text-chip';


export declare type ModifierPart = {
    key: string,
    name: string,
    defaultValueFn: (diceChip: DiceChip) => string,
    checkValueFn: (diceChip: DiceChip, value: any) => any
};
export declare type ModifierOption = {
    name: string,
    regex?: RegExp,
    parts?: ModifierPart[],
    key?: string
};
const SUCCESS_MODIFIER_PART: ModifierPart = {
    key: 's',
    name: 'Success at',
    defaultValueFn: (diceChip) => `${Math.floor(diceChip.sides * 0.7)}`,
    checkValueFn: defaultCheckValueFn
};

function defaultCheckValueFn(diceChip: DiceChip, value: any): any {
    if (value <= 1) {
        return 1;
    }
    if (value > diceChip.sides) {
        return diceChip.sides;
    }
    return value;
}

const EXPLODE_MODIFIER_PART: ModifierPart = {
    key: 'e',
    name: 'Explode at',
    defaultValueFn: (diceChip) => `${diceChip.sides}`,
    checkValueFn: defaultCheckValueFn
};
const MODIFIER_OPTIONS: ModifierOption[] = [
    {name: 'None', regex: /^$/},
    {name: 'Advantage', regex: /^adv$/, key: 'adv'},
    {name: 'Disadvantage', regex: /^dis$/, key: 'dis'},
    {name: 'Success', regex: /^s(?<s>\d+)$/, parts: [SUCCESS_MODIFIER_PART]},
    {name: 'Success with explosion', regex: /^s(?<s>\d+)e(?<e>\d+)$/, parts: [SUCCESS_MODIFIER_PART, EXPLODE_MODIFIER_PART]},
];

export class DiceChip {

    constructor(count: number, sides: number, modifier?: string) {
        this.count = count;
        this.modifier = modifier;
        this.sides = sides;
    }

    type = 'dice';
    count: number;
    modifier: string;
    sides: number;


    getText(): string {
        return `${this.count}d${this.sides}` + (this.modifier ? `[${this.modifier}]` : '');
    }

    getModifierPart(selectedOption: ModifierOption, key: ModifierPart): string | undefined {
        const regExpExecArray = selectedOption.regex.exec(this.modifier);
        return regExpExecArray?.groups[key.key];
    }

    setModifierPart(selectedOption: ModifierOption, key: ModifierPart, value: any): void {
        const validValue = key.checkValueFn(this, value);
        const regExp = new RegExp(key.key + '(\\d+)');
        const replace = this.modifier.replace(regExp, `${key.key}${validValue}`);
        if (selectedOption.regex.exec(replace)) {
            this.modifier = replace;
        }
    }

    modifierSelected(value: ModifierOption): void {
        if (value.parts) {
            let newMod = '';
            for (const part of value.parts) {
                newMod += part.key;
                const regExp = new RegExp(part.key + '(?<' + part.key + '>\\d+)');
                const group = regExp.exec(this.modifier)?.groups[part.key];
                if (group) {
                    newMod += group;
                } else {
                    newMod += part.defaultValueFn(this);
                }
            }
            this.modifier = newMod;
        } else if (value.key) {
            this.modifier = value.key;
        } else {
            this.modifier = undefined;
        }
    }

    setSides(sides: number): void {
        this.sides = sides;
        const currentModifierOption = this.getCurrentModifierOption();
        if (currentModifierOption.parts) {
            for (const part of currentModifierOption.parts) {
                this.setModifierPart(currentModifierOption, part, this.getModifierPart(currentModifierOption, part));
            }
        }
    }

    getCurrentModifierOption(): ModifierOption {
        for (const modifierOption of MODIFIER_OPTIONS) {
            if (modifierOption.regex.exec(this.modifier)) {
                return modifierOption;
            }
        }
        return MODIFIER_OPTIONS[0];
    }

    getModifierOptions(): ModifierOption[] {
        return MODIFIER_OPTIONS;
    }
}

