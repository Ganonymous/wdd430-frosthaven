import { Resources } from "../resources.model";

export class Character{
    constructor(
        public id: string,
        public campaign: string,
        public name: string,
        public level: string,
        public XP: number,
        public gold: number,
        public player: number,
        public resources: Resources,
        public mastery1: {requirement: string, complete: boolean},
        public mastery2: {requirement: string, complete: boolean},
        public checks: number,
        public perks: {name: string, effect: string}[],
        public status: string
    ){}
}