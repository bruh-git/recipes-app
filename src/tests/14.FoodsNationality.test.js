import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from '../helpers/renderWithRouterAndContext';
import fetchMock from './mocks/fetch';
import mealsMock from './mocks/meals';
import nationalitiesMock from './mocks/areas';
import italianMealsMock from './mocks/italianMeals';

beforeEach(() => {
  global.fetch = jest.fn(fetchMock);
});

afterEach(() => jest.clearAllMocks());

const pathname = '/explore/foods/nationalities';
const notFound = '/explore/drinks/nationalities';

describe('se os componentes Header e Footer funcionam corretamente', () => {
  it('se existe um header com o título Explore Nationalities', () => {
    renderWithRouterAndContext(pathname);
    const header = screen.getByRole('heading', { name: /Explore Nationalities/i });
    expect(header).toBeInTheDocument();
  });
  it('se existe um botão profile no header da pagina Explore Nationalities', () => {
    renderWithRouterAndContext(pathname);
    const nameText = screen.getByAltText('Profile Icon');
    expect(nameText).toBeInTheDocument();
  });
  it('se o botão profile leva o usuário até a página /profile', () => {
    const { history } = renderWithRouterAndContext(pathname);
    const profileButton = screen.getByRole('button', { name: 'Profile Icon' });
    userEvent.click(profileButton);
    expect(history.location.pathname).toBe('/profile');
  });
  it('se o botão foods no footer leva o usuário até a página /foods', () => {
    const { history } = renderWithRouterAndContext(pathname);
    const foodsButton = screen.getByRole('button', { name: 'food-icon' });
    userEvent.click(foodsButton);
    expect(history.location.pathname).toBe('/foods');
  });
  it('se o botão drinks no footer leva o usuário até a página /drinks', () => {
    const { history } = renderWithRouterAndContext(pathname);
    const drinksButton = screen.getByRole('button', { name: 'drink-icon' });
    userEvent.click(drinksButton);
    expect(history.location.pathname).toBe('/drinks');
  });
  it('se o botão explore no footer leva o usuário até a página /explore', () => {
    const { history } = renderWithRouterAndContext(pathname);
    const exploreButton = screen.getByRole('button', { name: 'explore-icon' });
    userEvent.click(exploreButton);
    expect(history.location.pathname).toBe('/explore');
  });
  it('se quando é clicado aparece o botão de pesquisa e desaparece de novo', () => {
    renderWithRouterAndContext(pathname);
    const searchIconButton = screen.getByRole('button', { name: 'Search Icon' });
    userEvent.click(searchIconButton);
    const inputSearch = screen.getByRole('textbox');
    expect(inputSearch).toBeInTheDocument();
    userEvent.click(searchIconButton);
    expect(inputSearch).not.toBeInTheDocument();
  });
  it('a rota `/explore/drinks/nationalities` ela retorna um erro de "Not Found"', () => {
    const { history } = renderWithRouterAndContext(notFound);
    expect(history.location.pathname).toBe(notFound);
    const notFoundText = screen.getByText('Not Found');
    expect(notFoundText).toBeInTheDocument();
  });
});

describe('se os filtros de nacionalidade funcionam corretamente', () => {
  const maxRecipes = 12;

  const checkFirstMeals = async (meals, limit = maxRecipes) => {
    meals.slice(0, limit).forEach(async (_meal, index) => {
      const recipeCard = await screen.findByTestId(`${index}-recipe-card`);
      expect(recipeCard).toBeInTheDocument();
    });
  };

  it(`se a pagina carrega com 12 comidas variadas
    e todas as opções de nacionalidades`, async () => {
    renderWithRouterAndContext(pathname);
    await checkFirstMeals(mealsMock.meals);

    // const nationalitiesDropdown = await screen
    //   .findByTestId('explore-by-nationality-dropdown');

    // userEvent.click(nationalitiesDropdown);

    // nationalitiesMock.meals.forEach(async (nationality) => {
    //   const nationalitiesOptions = await screen.findByTestId(`${nationality}-option`);
    //   expect(nationalitiesOptions).toBeInTheDocument();
    // });
  });

  it(`se ao clicar em uma nacionalidade as comidas são filtradas
  e ao clicar em all o filtro é retirado`, async () => {
    renderWithRouterAndContext(pathname);

    const nationalitiesDropdown = await screen
      .findByTestId('explore-by-nationality-dropdown');

    userEvent.click(nationalitiesDropdown);

    nationalitiesMock.meals.forEach(async (nationality) => {
      const nationalitiesOptions = await screen.findByTestId(`${nationality}-option`);
      expect(nationalitiesOptions).toBeInTheDocument();
    });

    userEvent.selectOptions(nationalitiesDropdown, ['Italian']);
    await checkFirstMeals(italianMealsMock.meals);

    userEvent.selectOptions(nationalitiesDropdown, ['All']);
    await checkFirstMeals(mealsMock.meals);
  });
});
