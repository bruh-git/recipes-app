import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from '../helpers/renderWithRouterAndContext';
import fetchMock from './mocks/fetch';

beforeEach(() => {
  global.fetch = jest.fn(fetchMock);
});

afterEach(() => jest.clearAllMocks());

const pathname = '/foods/52977/in-progress';

describe('Testa se a página ProgressRecipe funciona corretamente', () => {
  it('Testa se renderiza o nome corba na tela de progresso', async () => {
    renderWithRouterAndContext(pathname);
    const h1 = await screen.findByRole('heading', { name: /Spicy Arrabiata Penne/i });
    expect(h1).toBeInTheDocument();
  });
  it('Testa se ao habilitar os checkbox se o botão habita o botão', async () => {
    renderWithRouterAndContext(pathname);
    const checkboxPenne = await screen.findByRole('checkbox', { name: /penne rigate/i });
    userEvent.click(checkboxPenne);
    const checkboxOlive = await screen.findByRole('checkbox', { name: /olive oil/i });
    userEvent.click(checkboxOlive);
    const checkboxGarlic = await screen.findByRole('checkbox', { name: /garlic/i });
    userEvent.click(checkboxGarlic);
    const chopped = await screen.findByRole('checkbox', { name: /chopped tomatoes/i });
    userEvent.click(chopped);
    const checkboRed = await screen.findByRole('checkbox', { name: /red chile flakes/i });
    userEvent.click(checkboRed);
    const italian = await screen.findByRole('checkbox', { name: /italian seasoning/i });
    userEvent.click(italian);
    const checkboxBasil = await screen.findByRole('checkbox', { name: /basil/i });
    userEvent.click(checkboxBasil);
    const Parmigi = await screen.findByRole('checkbox', { name: /Parmigiano-Reggiano/i });
    userEvent.click(Parmigi);
    const buttonFinish = await screen.findByRole('button', { name: 'Finish' });
    expect(buttonFinish).toBeInTheDocument();
    expect(buttonFinish).toBeEnabled();
  });
  it('Testa se o botão Finish fica desabilitado', async () => {
    renderWithRouterAndContext(pathname);
    const checkboxPenne = await screen.findByRole('checkbox', { name: /penne rigate/i });
    userEvent.click(checkboxPenne);
    const checkboxOlive = await screen.findByRole('checkbox', { name: /olive oil/i });
    userEvent.click(checkboxOlive);
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
  // it('Ao clicar no botão de compartilhar aparece um texto de copiado', async () => {
  //   renderWithRouterAndContext(pathname);
  //   const ShareButton = await screen.findByRole('img', { name: 'Share Icon' });
  //   userEvent.click(ShareButton);
  //   const textCopied = await screen.findByText(/Link copied!/i);
  //   expect(textCopied).toBeInTheDocument();
  // });
});
