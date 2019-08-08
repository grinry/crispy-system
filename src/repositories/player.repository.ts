import { Repository } from "~app/repositories/repository";
import { Player } from "~app/utils/utils";

class PlayerRepository extends Repository<Player> {}

export const playerRepository: PlayerRepository = new PlayerRepository();
