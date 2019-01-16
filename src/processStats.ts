import child_process from 'child_process'

const windowsCommand = 'wmic PROCESS GET name,PrivatePageCount /format:rawxml'
const windowsPageSize = 0x1000

export class ProcessStats {
    read() {
        child_process.exec('wimc PROCESS')
    }
}