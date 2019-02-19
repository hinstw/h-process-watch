var parseString = require('xml2js').parseString;

import child_process from 'child_process';
import { largeSizeToText } from './text';
import { WtOutputRoot, WtOutputInstance, WtProperty } from './wimcType';

const desiredProperties = [
    WtProperty.name,
    WtProperty.processId,
    WtProperty.parentProcessId,
    WtProperty.privatePageCount,
];
const desiredPropertiesCommand = desiredProperties.join(',');
const windowsCommand = `wmic PROCESS GET ${desiredPropertiesCommand} /format:rawxml`;

export class ProcessStat {
    name: string;
    privatePageCount: number;
    processId: number;
    parentProcessId: number;
    toString() {
        return this.name + ' ' + largeSizeToText(this.privatePageCount);
    }
}

export class ProcessStats {
    read(): Promise<any> {
        return new Promise((resolve, reject) => {
            child_process.exec(windowsCommand, (error, stdout, stderr) => {
                if (error)
                    reject(error);
                parseString(stdout, (error, result: WtOutputRoot) => {
                    const instances = result.COMMAND.RESULTS[0].CIM[0].INSTANCE;
                    this.readInstances(instances);
                });
            })
        });
    }

    private readInstances(instances: WtOutputInstance[]) {
        const stats: ProcessStat[] = [];
        for (const instance of instances) {
            const stat = new ProcessStat();
            for (const property of instance.PROPERTY) {
                if (property.$.NAME == WtProperty.name)
                    stat.name = property.VALUE[0];
                if (property.$.NAME == WtProperty.privatePageCount)
                    stat.privatePageCount = parseInt(property.VALUE[0]);
            }
            stats.push(stat);
            console.log(stat.toString());
        }
        return stats;
    }
}