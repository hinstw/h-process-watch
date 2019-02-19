class WtOutputRoot {
    COMMAND: WtOutputCommand;
}

class WtOutputCommand {
    RESULTS: WtOutputResult[];
}

class WtOutputResult {
    CIM: WtOutputCim[];
}

class WtOutputCim {
    INSTANCE: WtOutputInstance[];
}

class WtOutputInstance {
    PROPERTY: [];
}