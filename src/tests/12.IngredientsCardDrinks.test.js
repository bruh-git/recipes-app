import { fireEvent, screen } from '@testing-library/react';
import renderWithRouterAndContext from '../helpers/renderWithRouterAndContext';
import fetchMock from './mocks/fetch';
import drinksByIngredient from './mocks/drinksByIngredient';
import drinks from './mocks/drinks';

beforeEach(() => {
  global.fetch = jest.fn(fetchMock);
});

afterEach(() => jest.clearAllMocks());
const checkFirstTwelveRecipes = async (indx, recipes) => {
  console.log(recipes);
  const Chicken = await screen.findByText(indx);
  expect(Chicken).toBeInTheDocument();

  const sixteen = 16;
  const buttonChicken = await screen.findAllByRole('button');
  expect(buttonChicken).toHaveLength(sixteen);
};

const redirectDrinks = async (drink, mock) => {
  console.log(mock);
  const redirectButton = await screen.findByText(drink);
  fireEvent.click(redirectButton);
};

const pathname = '/explore/drinks/ingredients';
describe('Testa se a pagina Explore Ingredients funciona corretamente', () => {
  it('Testa se existe um Header com nome Explore Ingredients', () => {
    renderWithRouterAndContext(pathname);
    const header = screen.getByRole('heading', { name: /Explore Ingredients/i });
    expect(header).toBeInTheDocument();
  });
  it('Se existe 4 botões na tela', () => {
    renderWithRouterAndContext(pathname);
    const four = 4;
    const buttonIngredient = screen.getAllByRole('button');
    expect(buttonIngredient).toHaveLength(four);
  });
  it('Testa se existe 12 + os 4 com os já existentes images de ingredients', async () => {
    renderWithRouterAndContext(pathname);
    await Promise.all([
      checkFirstTwelveRecipes('Light rum', drinksByIngredient.drinks),
      checkFirstTwelveRecipes('Applejack', drinksByIngredient.drinks),
      checkFirstTwelveRecipes('Gin', drinksByIngredient.drinks),
      checkFirstTwelveRecipes('Dark rum', drinksByIngredient.drinks),
      checkFirstTwelveRecipes('Sweet Vermouth', drinksByIngredient.drinks),
      checkFirstTwelveRecipes('Strawberry schnapps', drinksByIngredient.drinks),
      checkFirstTwelveRecipes('Scotch', drinksByIngredient.drinks),
      checkFirstTwelveRecipes('Apricot brandy', drinksByIngredient.drinks),
      checkFirstTwelveRecipes('Triple sec', drinksByIngredient.drinks),
      checkFirstTwelveRecipes('Southern Comfort', drinksByIngredient.drinks),
      checkFirstTwelveRecipes('Orange bitters', drinksByIngredient.drinks),
      checkFirstTwelveRecipes('Brandy', drinksByIngredient.drinks),
    ]);
  });
  it('Testa se ao clicar no botão de uma receita e redirecionando', async () => {
    renderWithRouterAndContext(pathname);
    redirectDrinks('Light rum', drinks);
    const Header = await screen.findByRole('heading', { name: 'Drinks' });
    expect(Header).toBeInTheDocument();
  });
});
