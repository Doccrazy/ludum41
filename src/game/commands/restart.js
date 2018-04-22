import store from "../../store";
import {COMMANDS} from "../../actions/console";
import initializeGame from "../../store/initializeGame";

function restart() {
  initializeGame(store);
}

COMMANDS.register('restart', restart);
COMMANDS.register('retry', restart, { alias: true });
