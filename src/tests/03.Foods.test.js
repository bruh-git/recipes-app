import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from '../helpers/renderWithRouterAndContext';
import fetchMock from './mocks/fetch';
import beefMeals from './mocks/beefMeals';
import breakfastMeals from './mocks/breakfastMeals';
import chickenMeals from './mocks/chickenMeals';
import dessertMeals from './mocks/dessertMeals';
import goatMeals from './mocks/goatMeals';
import meals from './mocks/meals';

beforeEach(() => {
  global.fetch = jest.fn(fetchMock);
});

afterEach(() => jest.clearAllMocks());

const FOOD_MAIN_PAGE_PATH = '/foods';
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
  test('se existe um elemento header na página', () => {
    renderWithRouterAndContext(FOOD_MAIN_PAGE_PATH);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  test('se o header possui um título com o nome que foi passado via props', () => {
    renderWithRouterAndContext(FOOD_MAIN_PAGE_PATH);
    const heading = screen.getByRole('heading', { name: 'Foods' });
    expect(heading).toBeInTheDocument();
  });

  test('se botão leva pra o usuário até a página /profile', () => {
    const { history } = renderWithRouterAndContext(FOOD_MAIN_PAGE_PATH);

    const profileButton = screen.getByRole('button', { name: 'Profile Icon' });
    userEvent.click(profileButton);
    expect(history.location.pathname).toBe('/profile');
  });

  test('se o input só aparece quando é clicado no botão de pesquisa', () => {
    renderWithRouterAndContext(FOOD_MAIN_PAGE_PATH);

    const searchIconButton = screen.getByRole('button', { name: SEARCH_ICON });
    userEvent.click(searchIconButton);
    const inputSearch = screen.getByRole('textbox');
    expect(inputSearch).toBeInTheDocument();

    userEvent.click(searchIconButton);
    expect(inputSearch).not.toBeInTheDocument();
  });

  test('se o filtro faz requisição à API', () => {
    renderWithRouterAndContext(FOOD_MAIN_PAGE_PATH);
    const initialNumberOfCalls = 8;
    const newNumberOfCalls = 9;
    expect(global.fetch).toBeCalledTimes(initialNumberOfCalls);

    const searchIconButton = screen.getByRole('button', { name: SEARCH_ICON });
    userEvent.click(searchIconButton);
    const inputSearch = screen.getByRole('textbox');
    userEvent.type(inputSearch, 'Chicken');

    const searchRadio = screen.getAllByRole('radio');
    userEvent.click(searchRadio[0]);
    const searchButton = screen.getByRole('button', { name: 'Search' });
    userEvent.click(searchButton);

    expect(global.fetch).toBeCalledTimes(newNumberOfCalls);
  });
});

describe('Teste se a página Foods renderiza as comidas corretamente', () => {
  test(`se quando o resultado de um filtro for uma comida só,
  ele redireciona para a página de detalhes`, async () => {
    renderWithRouterAndContext(FOOD_MAIN_PAGE_PATH);

    const searchIconButton = screen.getByRole('button', { name: SEARCH_ICON });
    userEvent.click(searchIconButton);
    const inputSearch = screen.getByRole('textbox');
    userEvent.type(inputSearch, 'Arrabiata');

    const searchRadio = screen.getAllByRole('radio');
    userEvent.click(searchRadio[1]);
    const searchButton = screen.getByRole('button', { name: 'Search' });
    userEvent.click(searchButton);

    const pageDetaislTitle = await screen
      .findByRole('heading', { name: 'Spicy Arrabiata Penne' });
    expect(pageDetaislTitle).toBeInTheDocument();
  });

  test('se os botões de categoria filtram corretamente', async () => {
    renderWithRouterAndContext(FOOD_MAIN_PAGE_PATH);

    await Promise.all([
      checkFirstTwelveRecipes('Beef', beefMeals.meals),
      checkFirstTwelveRecipes('Breakfast', breakfastMeals.meals),
      checkFirstTwelveRecipes('Chicken', chickenMeals.meals),
      checkFirstTwelveRecipes('Dessert', dessertMeals.meals),
      checkFirstTwelveRecipes('Goat', goatMeals.meals),
      checkFirstTwelveRecipes('All', meals.meals),
    ]);
  });
});
