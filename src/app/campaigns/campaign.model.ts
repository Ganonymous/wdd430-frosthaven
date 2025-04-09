import { Resources } from "../resources.model";
export class Campaign{
    constructor(
        public id: string,
        public groupname: string,
        public inspiration: number,
        public morale: number,
        public frosthavenResources: Resources,
        public stickers: string[],
        public buildings: {name: string, level: number, isWrecked: boolean}[],
        public prosperity: {level: number, progress: number, toNext: number},
        public guardUpgrades: {source: string, effect: string}[],
        public soldiers: number,
        public calendar: {year: number, week: number, lastH: {year: number, week: number}, pendingEvents: {year: number, week: number, section: number}[]}
    ){}
}