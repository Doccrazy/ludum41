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
      let candidates = Object.keys(this.commands).filter(c => c.startsWith(cmd));
      if (candidates.length > 1) {
        candidates = candidates.filter(cmd => !this.commands[cmd].alias);
      }
      if (candidates.length === 1) {
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
