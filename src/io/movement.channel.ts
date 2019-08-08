import { Namespace, Server, Socket } from "socket.io";
import { KeyValue, Player, Vector3 } from "~app/utils/utils";
import { playerRepository } from "~app/repositories/player.repository";
import { AbstractChannel } from "~app/abstractions/abstract-channel";


export class MovementChannel extends AbstractChannel {
  protected players: KeyValue<Player> = {};
  constructor(
    protected io: Server,
    protected channelName: string = '/',
    middleware?: (socket:Socket, fn: ( err?: any ) => void) => void
  ) {
    super(io, channelName, middleware);
  }
  public registerHandlers(): void {
    this.socket.on('initialize', () => this.onInitiliaze());
    this.socket.on('positionUpdate', (position: Vector3) => this.onPositionUpdate(position));
    this.socket.on('disconnect', () => this.onDisconnect());
  }
  protected async onInitiliaze() {
    const id = this.socket.id;
    const player = new Player(id);
    this.players[id] = player;
    playerRepository.add(player);
    this.socket.emit('playerData', { id, players: this.players });
    this.socket.broadcast.emit('playerJoined', player);
  }
  protected async onPositionUpdate(position: Vector3) {
    const player = this.players[this.socket.id];
    if (!player) return;
    player.position.set(position.x, position.y, position.z);
    this.socket.broadcast.emit('playerMoved', player);
  }
  public async onDisconnect() {
    if (!this.players[this.socket.id]) return;
    delete this.players[this.socket.id];
    this.socket.broadcast.emit('killPlayer', this.socket.id);
    console.log(`Player ${this.socket.id} left.`);
  }
}



// export default class VideoPokerController {
//   private allowedBets = [1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 100, 200, 300, 400, 500];
//
//   constructor(io: Server) {
//     io.of('/video-poker')
//       .use(authMiddleware)
//       .on('connection', (socket: Socket) => this.onConnect(io, socket));
//   }
//
//   async onConnect(io: Server, socket: Socket) {
//     logger.info('Player ' + socket.player.email + ' connected to video-poker.');
//
//     io.of('/video-poker').clients((error, clients) => {
//       if (error) {
//         throw error;
//       }
//       logger.info('There is ' + clients.length + ' players in video-poker.');
//     });
//
//     this.registerHandlers(io, socket);
//   }
//
//   registerHandlers(io: Server, socket: Socket) {
//     socket.on('init', (params, callback) => this.onInit(socket, params, callback));
//     socket.on('shuffle', (params, callback) => this.onShuffle(socket, params, callback));
//     socket.on('bet', (params, callback) => this.onBet(socket, params, callback));
//     socket.on('deal', (params, callback) => this.onDeal(socket, params, callback));
//     socket.on('notify', (params, callback) => this.onNotify(socket, params, callback));
//     socket.on('players', (params, callback) => this.onPlayers(io, socket, params, callback));
//     socket.on('disconnect', (params, callback) => this.onDisconnect(io, socket, params, callback));
//   }
//
//   async onInit(socket: Socket, params, callback) {
//     // logger.info('video-poker socket onInit handler');
//     try {
//       const settings = await GameSettingModel.getGame(GAME.VIDEO_POKER);
//       const user = await users.getStated(socket.player._id);
//       if (user.verified && user.verified.blocked) {
//         return callback({ error: 'Your account was suspended.', type: 'account_disabled' });
//       }
//       const testGame: boolean = !!params.testGame;
//       const testBalance: number = math.bignumber(params.testBalance).toNumber();
//
//       let game = !gameUtils.isGuest(socket)
//         ? await videoPokerService.findLostSession(socket.player._id, testGame)
//         : null;
//       if (!game) {
//         game = await videoPokerService.createGame(socket.player._id, testGame, testBalance);
//
//         logger.info(`video-poker initialized new game: ${JSON.stringify(game)}`);
//       } else {
//         logger.info(`video-poker found lost session: ${JSON.stringify(game)}`);
//       }
//
//       callback({ ...game, settings });
//     } catch (e) {
//       logger.error(`video-poker init error: ${e.message}`);
//
//       callback({ error: e });
//     }
//   }
//
//   async onShuffle(socket: Socket, params, callback) {
//     // logger.info('video-poker socket onShuffle handler');
//     try {
//       const game = await games.get(params.game);
//       if (
//         !game ||
//         game.game !== 'video-poker' ||
//         (game.version === 2 && String(game.userId) !== String(socket.player._id)) ||
//         !!game.finishedAt
//       ) {
//         return callback({ error: 'Game is not started!' });
//       }
//       const deck = await videoPokerService.shuffleDeck(game, params.seed);
//       callback(deck);
//     } catch (e) {
//       callback({ error: e.message });
//     }
//   }
//
//   async onBet(socket: Socket, params, callback) {
//     try {
//       const settings = await GameSettingModel.getGame(GAME.VIDEO_POKER);
//       const user = await users.getStated(socket.player._id);
//       if (!user._id) {
//         return callback({ error: 'Only registered users can play.', type: 'unauthorized' });
//       }
//       if (user.verified && user.verified.blocked) {
//         return callback({ error: 'Your account was suspended.', type: 'account_disabled' });
//       }
//       if (user.isVerificationDeclined()) {
//         return callback({
//           error: 'KYC declined users are not allowed to play',
//           type: 'account_declined',
//         });
//       }
//
//       const game = await games.get(params.game);
//       if (!game) {
//         return callback({
//           type: 'no_game',
//           error: 'Game is not started.',
//         });
//       }
//
//       const bet = math.bignumber(params.bet).toNumber();
//
//       if (
//         !game ||
//         game.game !== 'video-poker' ||
//         (game.version === 2 && String(game.userId) !== String(socket.player._id)) ||
//         !!game.finishedAt
//       ) {
//         return callback({ error: 'Game is not started!' });
//       }
//
//       if (game.gameData.shuffledDeck === null || !Array.isArray(game.gameData.shuffledDeck)) {
//         return callback({ error: 'Game is not initialized.' });
//       }
//
//       if (!this.allowedBets.includes(bet)) {
//         return callback({
//           error: `Invalid bet amount ${bet} edg. Must be one of [${this.allowedBets.toString()}]`,
//         });
//       }
//
//       if (gameUtils.isGuest(socket)) {
//         if (math.smaller(game.guestBalance, bet)) {
//           return callback({ error: 'Insufficient balance.' });
//         }
//       } else {
//         if (math.smaller(getBalance(user, game.isTestGame), videoPokerService.calculateBet(bet, 'updateState'))) {
//           return callback({ error: 'Insufficient balance.' });
//         }
//       }
//
//       videoPokerService.dealFirstCards(game);
//
//       game.signatures = [{ start: params.sign }];
//       game.bet = bet;
//       game.isBonusBet = !gameUtils.isGuest(socket) && isBonusBet(user, bet);
//       game.status = 'running';
//
//       if (game.bet > 0 && !game.isTestGame) {
//         await wagerService.addWager(
//           game.userId,
//           GameType.VideoPoker,
//           Math.min(game.bet, settings.maxWager),
//           settings.wagerMultiplier
//         );
//       }
//
//       if (!gameUtils.isGuest(socket)) {
//         if (!game.isTestGame) {
//           const state = await validate.verifySignature(user, params, -Number(math.multiply(bet, ONE_EDG)), 1);
//           if (!state.success) {
//             return callback(state);
//           }
//         }
//         await addBalanceAndNotify(
//           user,
//           -bet,
//           game.isBonusBet ? BalanceTransactionType.BONUS_BET : BalanceTransactionType.GAME_BET,
//           game.isTestGame
//         );
//       } else {
//         game.guestBalance = math.subtract(math.bignumber(game.guestBalance), math.bignumber(game.bet)).toNumber();
//         gameUtils.notifyClient(socket, 'balance', game.guestBalance);
//       }
//
//       const result = await videoPokerService.updateGameAndRespond(game, {
//         firstCards: game.gameData.firstCards,
//         autoHold: game.gameData.autoHold,
//       });
//       callback(result);
//     } catch (e) {
//       logger.error(e);
//       callback({ error: e.message });
//     }
//   }
//
//   async onDeal(socket: Socket, params, callback) {
//     try {
//       const game = await games.get(params.game);
//       const user = await users.getStated(game.userId);
//       const initBalance = getBalance(user);
//       const initBalanceDemo = getBalance(user, true);
//
//       if (!user._id) {
//         return callback({ error: 'Only registered users can play.', type: 'unauthorized' });
//       }
//
//       if (user.verified && user.verified.blocked) {
//         return callback({ error: 'Your account was suspended.', type: 'account_disabled' });
//       }
//
//       if (
//         !game ||
//         game.game !== 'video-poker' ||
//         (game.version === 2 && String(game.userId) !== String(socket.player._id))
//       ) {
//         return callback({ error: 'Game is not started!' });
//       }
//
//       if (game.finishedAt) {
//         return callback({ error: 'This game is already finished!' });
//       }
//
//       if (params.selectedCards.length > game.gameData.firstCards.length) {
//         return callback({ error: 'Invalid number of cards selected!' });
//       }
//
//       for (let i = 0; i < params.selectedCards.length; i++) {
//         if (game.gameData.firstCards[params.selectedCards[i]] === undefined) {
//           return callback({ error: 'Invalid card selected!' });
//         }
//       }
//
//       const cardsToReplace = game.gameData.firstCards.length - params.selectedCards.length;
//       logger.info(`Selected cards: ${JSON.stringify(params.selectedCards)}`);
//       logger.info(`Cards to replace: ${cardsToReplace}`);
//       logger.info(`Shuffled deck: ${JSON.stringify(game.gameData.shuffledDeck)}`);
//       logger.info(
//         `First cards: ${JSON.stringify(videoPokerService.mapCards(game.gameData.firstCards))} (indexes: ${JSON.stringify(
//           game.gameData.firstCards
//         )})`
//       );
//       const newCards = game.gameData.shuffledDeck.slice(
//         game.gameData.firstCards.length,
//         game.gameData.firstCards.length + cardsToReplace
//       );
//
//       // const newCards = [0, 1, 6, 19, 32];
//
//       logger.info(
//         `New cards: ${JSON.stringify(videoPokerService.mapCards(newCards))} (indexes: ${JSON.stringify(newCards)})`
//       );
//       game.gameData.selectedCards = params.selectedCards.map(cardIdx => game.gameData.firstCards[cardIdx]);
//       game.gameData.replacedCards = newCards;
//       game.signatures.push({ deal: params.sign });
//
//       const payout = await videoPokerService.determinePayout(game);
//
//       let newBalance = gameUtils.isGuest(socket) ? game.guestBalance : getBalance(user, game.isTestGame);
//
//       game.profit = math.subtract(math.bignumber(payout), math.bignumber(game.bet));
//       game.outcome = payout;
//       game.finishedAt = new Date();
//       game.status = 'finished';
//
//       await videoPokerService.updateGameAndRespond(game, null);
//
//       if (math.larger(math.bignumber(payout), 0)) {
//         if (gameUtils.isGuest(socket)) {
//           newBalance = math.add(math.bignumber(game.guestBalance), math.bignumber(payout)).toNumber();
//         } else {
//           newBalance = await addBalance(
//             user,
//             payout,
//             game.isBonusBet ? BalanceTransactionType.BONUS_PROFIT : BalanceTransactionType.GAME_PROFIT,
//             game.isTestGame ? BalanceCurrencyType.DEMO : BalanceCurrencyType.EDG
//           );
//         }
//       }
//
//       callback({
//         serverSeed: game.serverSeed,
//         playerSeed: game.playerSeed,
//         hashedServerSeed: game.hashedServerSeed,
//         payout,
//         win: payout > 0,
//         bet: game.bet,
//         profit: game.profit,
//         balance: newBalance,
//         replacedCards: newCards,
//         game: game._id,
//         handRank: game.gameData.handRank,
//         handDescr: game.gameData.handDescr,
//         highestHand: game.gameData.highestHand,
//         chestAward: game.gameData.chestAward,
//         isTestGame: game.isTestGame,
//       });
//
//       // Track bets
//       if (!gameUtils.isGuest(socket)) {
//         this.trackAmplitude(game, payout, game.isTestGame ? initBalanceDemo : initBalance, user);
//       }
//
//       if (!gameUtils.isGuest(socket)) {
//         await videoPokerService.logResult(game, user);
//       }
//     } catch (e) {
//       logger.error(e);
//       callback(e.message);
//     }
//   }
//
//   async onNotify(socket: Socket, params, callback) {
//     try {
//       const user = await users.getStated(socket.player._id);
//       const game = await games.get(params.game);
//       if (user && game && game.finishedAt) {
//         await sendBalance(socket.player._id, game.isTestGame ? user.balance.server.edg : user.balance.main.edg);
//         await videoPokerService.logResult(game, user);
//       }
//     } catch (e) {
//       logger.error(e);
//     }
//   }
//
//   async onPlayers(io: Server, socket: Socket, params, callback) {
//     io.of('/video-poker').clients((error, clients) => {
//       if (error) {
//         throw error;
//       }
//       callback({ count: clients.length });
//     });
//   }
//
//   async onDisconnect(io: Server, socket: Socket, params, callback) {
//     logger.info('Player ' + socket.player.email + ' left video-poker.');
//     io.of('/video-poker').clients((error, clients) => {
//       if (error) {
//         throw error;
//       }
//       logger.info('There is ' + clients.length + ' players in video-poker.');
//     });
//   }
//
//   async trackAmplitude(game, payout, initBalance, user) {
//     if (!game.isTestGame) {
//       if (!game.isBonusBet) {
//         amplitude.track({
//           event_type: 'Video poker - Bet',
//           user_id: game.userId,
//           event_properties: {
//             Amount: game.bet,
//             Profit: game.profit,
//             Payout: payout,
//             'Balance Before': initBalance,
//             'Balance After': getBalance(user),
//           },
//         });
//       } else {
//         amplitude.track({
//           event_type: 'Video poker - Bonus Bet',
//           user_id: game.userId,
//           event_properties: {
//             Amount: game.bet,
//             Profit: game.profit,
//             Payout: payout,
//             'Balance Before': initBalance,
//             'Balance After': getBalance(user),
//           },
//         });
//       }
//     } else {
//       amplitude.track({
//         event_type: 'Video poker - Demo Bet',
//         user_id: game.userId,
//         event_properties: {
//           Amount: game.bet,
//           Profit: game.profit,
//           Payout: payout,
//           'Balance Before': initBalance,
//           'Balance After': getBalance(user, true),
//         },
//       });
//     }
//   }
// }
