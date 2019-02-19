var parseString = require('xml2js').parseString;

import child_process from 'child_process'

const windowsCommand = 'wmic PROCESS GET name,PrivatePageCount /format:rawxml'
const windowsPageSize = 0x1000

export class ProcessStat {
    name: string;
    privatePageCount: number;
}

export class ProcessStats {
    read(): Promise<any> {
        return new Promise((resolve, reject) => {
            child_process.exec(windowsCommand, (error, stdout, stderr) => {
                if (error)
                    reject(error);
                parseString(stdout, (error, result: WtOutputRoot) => {
                    const instances = result.COMMAND.RESULTS[0].CIM[0].INSTANCE;
                    console.log(instances);
                });
            })
        });
    }
}