export default class CommandRegistry {
  commands = {};
  errorMsg;

  constructor(errorMsg) {
    this.errorMsg = errorMsg || 'Unknown command $cmd';
  }

  register(cmd, handler) {
    if (typeof handler === 'function') {
      this.commands[cmd] = handler;
    } else {
      const subRegistry = new CommandRegistry(handler);
      this.commands[cmd] = subRegistry.handle;
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
      if (candidates.length > 0 && candidates.reduce((a, b) => this.commands[a] === this.commands[b] ? a : null)) {
        commandObj = this.commands[candidates[0]];
      }
    }

    if (commandObj) {
      return commandObj(rest, ...args);
    } else {
      return new Error(this.errorMsg.replace('$cmd', cmdLine));
    }
  }
}
