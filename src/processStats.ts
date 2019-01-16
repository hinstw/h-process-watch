import child_process from 'child_process'

const windowsCommand = 'wmic PROCESS GET name,PrivatePageCount /format:rawxml'
const windowsPageSize = 0x1000

export class ProcessStats {
    read(): Promise<any> {
        return new Promise((resolve, reject) => {
            child_process.exec(windowsCommand, (error, stdout, stderr) => {
                if (error)
                    reject(error);
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(stdout, "text/xml");    
            })
        });
    }
}