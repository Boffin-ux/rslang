import { ViewPath } from '../../common/constants';
import { SprintStartPage } from './common/startPage';
import { BaseGameView } from './common/baseGame';
import { GameType } from '../../controllers/constants';
import { IApiWords } from '../../models/interfaces';
import CreateMarkup from './../common/createMarkup';
import { GameCardData } from '../../controllers/types';
import { AnswerBtnType } from '../constants';

export class SprintView extends BaseGameView {
  private word: HTMLElement | undefined;

  private translation: HTMLElement | undefined;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.startPage = new SprintStartPage();
    this.word = undefined;
    this.translation = undefined;
  }

  static getPath(): string {
    return ViewPath.SPRINT;
  }

  getGameType(): GameType {
    return GameType.Sprint;
  }

  showWord(data: GameCardData): void {
    if (this.word && this.translation) {
      this.word.textContent = data.word.word;
      this.translation.textContent = data.options[0];
    }
  }

  processKey(event: KeyboardEvent): void {
    const key = event.key;
    if (key == 'ArrowLeft' || key == 'ArrowRight') {
      const selectedOption = key === 'ArrowLeft' ? AnswerBtnType.Correct : AnswerBtnType.Incorrect;
      this.ctrl?.processAnswer(selectedOption);
    }
  }

  createWordCard(word: IApiWords): HTMLElement {
    const card = document.createElement('div');
    card.className = 'game-card wrapper';
    const points = new CreateMarkup(card, 'div', 'points');
    const guessedWords = new CreateMarkup(points.node, 'div', 'guessed-words');

    const pointsСounter = new CreateMarkup(points.node, 'div', 'points-counter');
    const score = new CreateMarkup(pointsСounter.node, 'span', 'points__score', '10');
    pointsСounter.node.innerHTML = `+${pointsСounter.node.innerHTML} очков`;

    const cardWord = new CreateMarkup(card, 'div', 'game-card__word game-word');
    const originWord = new CreateMarkup(cardWord.node, 'h3', 'game-word__origin');
    originWord.node.textContent = word.word;
    const translation = new CreateMarkup(cardWord.node, 'span', 'game-word__translate');
    translation.node.textContent = word.wordTranslate;

    this.word = originWord.node;
    this.translation = translation.node;
    this.pointsBlock = score.node;

    const controls = new CreateMarkup(card, 'div', 'game-card__controls');
    const isTrueBtn = new CreateMarkup(controls.node, 'button', 'button game-card__btn game-card__btn_true');
    isTrueBtn.node.textContent = 'Верно';
    isTrueBtn.node.id = String(AnswerBtnType.Correct);

    const isFalseBtn = new CreateMarkup(controls.node, 'button', 'button game-card__btn game-card__btn_false');
    isFalseBtn.node.id = String(AnswerBtnType.Incorrect);
    isFalseBtn.node.textContent = 'Неверно';

    this.gameControls = controls.node;

    return card;
  }
}
