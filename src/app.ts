import { ProcessStats } from "./processStats";

export class App {
    run() {
        console.log('Now running app...');
        setInterval(() => this.tickCheck(), 5000);
    }
    async tickCheck() {
        const processStats = new ProcessStats();
        await processStats.read();
    }
    throw() {
        throw new Error('Test');
    }
}