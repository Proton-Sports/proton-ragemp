export type Ui = BrowserMp;

export const createUi = (url: string) => {
    return mp.browsers.new(url) as Ui;
};
