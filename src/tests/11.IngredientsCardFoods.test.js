import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from '../helpers/renderWithRouterAndContext';
import fetchMock from './mocks/fetch';
import mealsByIngredient from './mocks/mealsByIngredient';
import meals from './mocks/meals';

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

const redirectFoods = async (meal, mock) => {
  console.log(mock);
  const redirectButton = await screen.findByText(meal);
  userEvent.click(redirectButton);
};

const pathname = '/explore/foods/ingredients';
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
      checkFirstTwelveRecipes('Chicken', mealsByIngredient.meals),
      checkFirstTwelveRecipes('Salmon', mealsByIngredient.meals),
      checkFirstTwelveRecipes('Beef', mealsByIngredient.meals),
      checkFirstTwelveRecipes('Pork', mealsByIngredient.meals),
      checkFirstTwelveRecipes('Avocado', mealsByIngredient.meals),
      checkFirstTwelveRecipes('Apple Cider Vinegar', mealsByIngredient.meals),
      checkFirstTwelveRecipes('Asparagus', mealsByIngredient.meals),
      checkFirstTwelveRecipes('Aubergine', mealsByIngredient.meals),
      checkFirstTwelveRecipes('Baby Plum Tomatoes', mealsByIngredient.meals),
      checkFirstTwelveRecipes('Bacon', mealsByIngredient.meals),
      checkFirstTwelveRecipes('Baking Powder', mealsByIngredient.meals),
      checkFirstTwelveRecipes('Balsamic Vinegar', mealsByIngredient.meals),
    ]);
  });
  it('Testa se ao clicar no botão de uma receita e redirecionando', async () => {
    renderWithRouterAndContext(pathname);
    redirectFoods('Chicken', meals);
    const Header = await screen.findByRole('heading', { name: 'Foods' });
    expect(Header).toBeInTheDocument();
  });
});
