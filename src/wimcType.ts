export const windowsPageSize = 0x1000

export enum WtProperty {
    name = 'Name',
    parentProcessId = 'ParentProcessId',
    privatePageCount = 'PrivatePageCount',
    processId = 'ProcessId'
}

export class WtOutputRoot {
    COMMAND: WtOutputCommand;
}

export class WtOutputCommand {
    RESULTS: WtOutputResult[];
}

export class WtOutputResult {
    CIM: WtOutputCim[];
}

export class WtOutputCim {
    INSTANCE: WtOutputInstance[];
}

export class WtOutputInstance {
    PROPERTY: WtOutputProperty[];
}

export class WtOutputProperty {
    $: { NAME: string; };
    VALUE: any[];
}