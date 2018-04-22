import store from "../../store";
import {COMMANDS} from "../../actions/console";
import initializeGame from "../../store/initializeGame";

function restart(difficulty) {
  initializeGame(store, difficulty);
}

COMMANDS.register('restart', restart);
COMMANDS.register('start', restart, { alias: true });
COMMANDS.register('retry', restart, { alias: true });
