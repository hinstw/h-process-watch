const parseString = require('xml2js').parseString;

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
    clone() {
        const result = new ProcessStat();
        result.name = this.name;
        result.privatePageCount = this.privatePageCount;
        result.processId = this.processId;
        result.parentProcessId = this.parentProcessId;
        return result;
    }
}

export class ProcessStats {
    stats: ProcessStat[];
    groupedStats: ProcessStat[];

    read(): Promise<any> {
        return new Promise((resolve, reject) => {
            child_process.exec(windowsCommand, (error, stdout, stderr) => {
                if (error)
                    reject(error);
                parseString(stdout, (error, result: WtOutputRoot) => {
                    const instances = result.COMMAND.RESULTS[0].CIM[0].INSTANCE;
                    this.stats = this.readInstances(instances);
                    this.groupedStats = groupStats(this.stats);
                    for (const stat of this.groupedStats)
                        console.log(stat.toString());
                    resolve();
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
        }
        return stats;
    }
}

function groupStats(stats: ProcessStat[]) {
    stats = stats.map(stat => stat.clone());
    const groupedStats: ProcessStat[] = [];
    for (const stat of stats) {
        const selfRoot = findSelfRoot(stat, stats);
        if (selfRoot == null)
            groupedStats.push(stat);
        else
            selfRoot.privatePageCount += stat.privatePageCount;
    }
    console.log(stats.length, groupedStats.length);
    return groupedStats;
}

function findSelfRoot(stat: ProcessStat, stats: ProcessStat[]) {
    const parents = findParents(stat, stats);

    if (parents.length > 0)
        return parents[parents.length - 1];
    else
        return null;
}

function findParents(stat: ProcessStat, stats: ProcessStat[]) {
    const parents: ProcessStat[] = [];
    stats = stats.filter(s => s.processId != 0 && s.processId != null);
    console.log(stats.length);
    while (true) {
        const parent = stats.find(s => s.processId == stat.parentProcessId);
        if (parent == null)
            break;
        parents.push(parent);
        stat = parent;
    }
    return parents;
}
