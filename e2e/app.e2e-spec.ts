import { StudyGermanyWebPage } from './app.po';

describe('study-germany-web App', () => {
  let page: StudyGermanyWebPage;

  beforeEach(() => {
    page = new StudyGermanyWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
