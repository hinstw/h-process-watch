var parseString = require('xml2js').parseString;

import child_process from 'child_process'
import { largeSizeToText } from './text';
import { windowsPageSize, WtOutputRoot, WtOutputInstance } from './wimcType';

const windowsCommand = 'wmic PROCESS GET name,PrivatePageCount /format:rawxml'

export class ProcessStat {
    name: string;
    privatePageCount: number;
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
        for (const instance of instances) {
            const stat = new ProcessStat();
            for (const property of instance.PROPERTY) {
                if (property.$.NAME == 'Name')
                    stat.name = property.VALUE[0];
                if (property.$.NAME == 'PrivatePageCount')
                    stat.privatePageCount = parseInt(property.VALUE[0]);
            }
            console.log(stat.toString());
        }
    }
}