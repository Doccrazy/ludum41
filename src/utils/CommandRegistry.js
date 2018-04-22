export default class CommandRegistry {
  commands = {};
  errorMsg;

  constructor(errorMsg) {
    this.errorMsg = errorMsg || 'Unknown command $cmd';
  }

  register(cmd, handler, options = {}) {
    if (typeof handler === 'function') {
      this.commands[cmd] = { ...options, handler };
    } else {
      const subRegistry = new CommandRegistry(handler);
      this.commands[cmd] = { ...options, handler: subRegistry.handle };
      return subRegistry;
    }
  }

  handle = (cmdLine, ...args) => {
    const m = /(\w+)\s*(.*)/.exec(cmdLine) || [];
    const cmd = m[1];
    const rest = m[2];

    let commandObj = this.commands[cmd];
    if (!commandObj) {
      const candidates = Object.keys(this.commands).filter(c => c.startsWith(cmd));
      if (candidates.length > 0 && candidates.reduce((a, b) => this.commands[a].handler === this.commands[b].handler ? a : null)) {
        commandObj = this.commands[candidates[0]];
      }
    }

    if (commandObj) {
      return commandObj.handler(rest, ...args);
    } else {
      return new Error(this.errorMsg.replace('$cmd', cmdLine));
    }
  };

  autocomplete(cmdLine) {
    let result = Object.keys(this.commands).sort();
    if (cmdLine.trim()) {
      const m = /(\w+)\s*(.*)/.exec(cmdLine) || [];
      const cmd = m[1];
      result = result.filter(c => c.startsWith(cmd));
    }
    return result.length > 1 ? result.filter(cmd => !this.commands[cmd].alias) : result;
  }
}
