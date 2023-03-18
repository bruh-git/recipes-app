import { screen } from '@testing-library/react';
import renderWithRouterAndContext from '../helpers/renderWithRouterAndContext';
import fetchMock from './mocks/fetch';

beforeEach(() => {
  global.fetch = jest.fn(fetchMock);
});

afterEach(() => jest.clearAllMocks());

const DETAILS_FOOD = '/foods/52771';

describe('Teste se o componente Details funciona corretamente', () => {
  test('se existe uma comida chamada Spicy Arrabiata Penne', async () => {
    renderWithRouterAndContext(DETAILS_FOOD);
    const title = await screen.findByRole('heading', { name: 'Spicy Arrabiata Penne' });
    expect(title).toBeInTheDocument();
  });
  test('se existe uma img da receita Arrabiata', async () => {
    renderWithRouterAndContext(DETAILS_FOOD);
    const img = await screen.findByAltText('recipe');
    expect(img).toHaveAttribute('src', 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg');
  });
  test('se existe botão de compartilhar', () => {
    renderWithRouterAndContext(DETAILS_FOOD);
    const buttonShare = screen.getByRole('button', { name: /share-btn-with-img/i });
    expect(buttonShare).toBeInTheDocument();
  });
  test('se existe botão de favoritar', () => {
    renderWithRouterAndContext(DETAILS_FOOD);
    const buttonFavorite = screen.getByRole('button', { name: /heart icon/i });
    expect(buttonFavorite).toBeInTheDocument();
  });
  test('se existe um texto com o nome da categoria da receita', async () => {
    renderWithRouterAndContext(DETAILS_FOOD);
    const spanWithCategory = await screen.findByTestId('recipe-category');
    expect(spanWithCategory).toBeInTheDocument();
    expect(spanWithCategory).toHaveTextContent('Vegetarian');
  });
  test('se existe uma lista com os ingredientes da receita', async () => {
    renderWithRouterAndContext(DETAILS_FOOD);
    const eigth = 8;
    const lis = await screen.findAllByTestId(/ingredient-name-and-measure/i);
    const ingredients = ['penne rigate', 'olive oil', 'garlic', 'chopped tomatoes',
      'red chile flakes', 'italian seasoning', 'basil', 'Parmigiano-Reggiano'];
    lis.forEach((ingredient, index) => {
      expect(ingredient).toHaveTextContent(ingredients[index]);
    });
    expect(lis).toHaveLength(eigth);
  });
  test('se há vídeo da receita', async () => {
    renderWithRouterAndContext(DETAILS_FOOD);
    const video = await screen.findByTestId('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', 'https://www.youtube.com/watch?v=1IszT_guI08');
  });
});
describe('Teste se o componente Details funciona corretamente, parte II', () => {
  test('se há cards de recomendação para drinks', async () => {
    renderWithRouterAndContext(DETAILS_FOOD);
    const six = 6;
    const cardsRecomendation = await screen.findAllByTestId(/recomendation-card/i);
    expect(cardsRecomendation).toHaveLength(six);
    const titleRecomendation = await screen.findAllByTestId(/recomendation-title/i);
    expect(titleRecomendation).toHaveLength(six);
    const drinks = ['GG', 'A1', 'ABC', 'Kir', '747', '252'];
    titleRecomendation.forEach((drink, index) => {
      expect(drink).toHaveTextContent(drinks[index]);
    });
  });
  test('se as instruções são da receita Arrabiata', async () => {
    renderWithRouterAndContext(DETAILS_FOOD);
    const paragraphWithInstructions = await screen.findByTestId('instructions');
    expect(paragraphWithInstructions).toBeInTheDocument();
    expect(paragraphWithInstructions).toHaveTextContent(/Bring a large pot of water/i);
  });
});
