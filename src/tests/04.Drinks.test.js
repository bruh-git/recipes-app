import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from '../helpers/renderWithRouterAndContext';
import fetchMock from './mocks/fetch';
import ordinaryDrinks from './mocks/ordinaryDrinks';
import cocktailDrinks from './mocks/cocktailDrinks';
import milkDrinks from './mocks/milkDrinks';
import otherDrinks from './mocks/otherDrinks';
import cocoaDrinks from './mocks/cocoaDrinks';
import drinks from './mocks/drinks';

beforeEach(() => {
  global.fetch = jest.fn(fetchMock);
});

afterEach(() => jest.clearAllMocks());

const DRINK_PAGE_PATH = '/drinks';
const SEARCH_ICON = 'Search Icon';

const checkFirstTwelveRecipes = async (category, recipes) => {
  const categoryButton = await screen.findByTestId(`${category}-category-filter`);
  expect(categoryButton).toBeInTheDocument();
  userEvent.click(categoryButton);

  const maxRecipes = 12;
  recipes.slice(0, maxRecipes).forEach((recipe, index) => {
    const recipeCard = screen.getByTestId(`${index}-recipe-card`);
    expect(recipeCard).toBeInTheDocument();
  });
};

describe('Teste se o componente Header funciona corretamente', () => {
  test('se o header possui um título com o nome que foi passado via props', () => {
    renderWithRouterAndContext(DRINK_PAGE_PATH);
    const heading = screen.getByRole('heading', { name: 'Drinks' });
    expect(heading).toBeInTheDocument();
  });
});

describe('Teste se a página Drinks renderiza as bebidas corretamente', () => {
  it(`se quando o resultado de um filtro for uma bebida só,
  ele redireciona para a página de detalhes`, async () => {
    renderWithRouterAndContext(DRINK_PAGE_PATH);

    const searchIconButton = screen.getByRole('button', { name: SEARCH_ICON });
    userEvent.click(searchIconButton);
    const inputSearch = screen.getByRole('textbox');
    userEvent.type(inputSearch, 'Aquamarine');

    const searchRadio = screen.getAllByRole('radio');
    userEvent.click(searchRadio[1]);
    const searchButton = screen.getByRole('button', { name: 'Search' });
    userEvent.click(searchButton);

    const pageDetaislTitle = await screen
      .findByRole('heading', { name: 'Aquamarine' });
    expect(pageDetaislTitle).toBeInTheDocument();
  });

  test('se os botões de categoria filtram corretamente', async () => {
    renderWithRouterAndContext(DRINK_PAGE_PATH);

    await Promise.all([
      checkFirstTwelveRecipes('Ordinary Drink', ordinaryDrinks.drinks),
      checkFirstTwelveRecipes('Cocktail', cocktailDrinks.drinks),
      checkFirstTwelveRecipes('Milk / Float / Shake', milkDrinks.drinks),
      checkFirstTwelveRecipes('Other/Unknown', otherDrinks.drinks),
      checkFirstTwelveRecipes('Cocoa', cocoaDrinks.drinks),
      checkFirstTwelveRecipes('All', drinks.drinks),
    ]);
  });
});
