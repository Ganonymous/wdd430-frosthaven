export class Scenario{
    constructor(
        public id: string,
        public campaign: string,
        public scenarioNumber: number,
        public name: string,
        public status: string,
        public requirements: string[],
        public remainingLoot: {lootable: string, remaining: boolean}[],
        public completionDate: {year: number, week: number}
    ){}
}