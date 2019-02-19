import { ProcessStats } from "./processStats";


export class App {
    processStats: ProcessStats;
    run() {
        console.log('Now running app...');
        this.processStats = new ProcessStats();
        setInterval(() => this.tickCheck(), 5000);
    }
    async tickCheck() {
        await this.processStats.read();
    }
    throw() {
        throw new Error('Test');
    }
}