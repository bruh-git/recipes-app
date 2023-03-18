import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from '../helpers/renderWithRouterAndContext';
import fetchMock from './mocks/fetch';

beforeEach(() => {
  global.fetch = jest.fn(fetchMock);
});

afterEach(() => jest.clearAllMocks());

const pathname = '/drinks/178319/in-progress';
describe('Testa se a página ProgressRecipe funciona corretamente', () => {
  it('Testa se renderiza o nome Aquamarine na tela de progresso', async () => {
    renderWithRouterAndContext(pathname);
    const h1 = await screen.findByRole('heading', { name: /Aquamarine/i });
    expect(h1).toBeInTheDocument();
  });
  it('Testa se ao habilitar os checkbox se o botão habita o botão', async () => {
    renderWithRouterAndContext(pathname);
    const checkboxHpnotiq = await screen.findByRole('checkbox', { name: /Hpnotiq/i });
    userEvent.click(checkboxHpnotiq);
    const pineapple = await screen.findByRole('checkbox', { name: /Pineapple Juice/i });
    userEvent.click(pineapple);
    const banana = await screen.findByRole('checkbox', { name: /Banana Liqueur/i });
    userEvent.click(banana);
    const buttonFinish = await screen.findByRole('button', { name: 'Finish' });
    expect(buttonFinish).toBeInTheDocument();
    expect(buttonFinish).toBeEnabled();
  });
  it('Testa se o botão Finish fica desabilitado', async () => {
    renderWithRouterAndContext(pathname);
    const checkboxHpnotiq = await screen.findByRole('checkbox', { name: /Hpnotiq/i });
    userEvent.click(checkboxHpnotiq);
    const pineapple = await screen.findByRole('checkbox', { name: /Pineapple Juice/i });
    userEvent.click(pineapple);
    const buttonFinish = await screen.findByRole('button', { name: 'Finish' });
    expect(buttonFinish).toBeInTheDocument();
    expect(buttonFinish).toBeDisabled();
  });
});
describe('Continuando os testes', () => {
  it('Verifica se existe dois botões de compartilhar, favoritar e Finish', async () => {
    renderWithRouterAndContext(pathname);
    const imgShare = await screen.findByRole('img', { name: 'Share Icon' });
    const imgHeart = await screen.findByRole('img', { name: 'Heart Icon' });
    const buttonFinish = screen.getByRole('button', { name: 'Finish' });
    expect(buttonFinish).toBeInTheDocument();
    expect(imgShare).toBeInTheDocument();
    expect(imgHeart).toBeInTheDocument();
  });
  it('Testa se ao favoritar a imagem troca de cor', async () => {
    const urlWhite = 'whiteHeartIcon.svg';
    const urlDark = 'blackHeartIcon.svg';
    renderWithRouterAndContext(pathname);
    const image = await screen.findByRole('img', { name: /Heart Icon/i });
    expect(image).toHaveAttribute('src', urlWhite);
    userEvent.click(image);
    expect(image).toHaveAttribute('src', urlDark);
  });
});
