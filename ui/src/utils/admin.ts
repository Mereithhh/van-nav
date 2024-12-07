import pinyin from 'pinyin-match';

export const getOptions = (rawList: any) => {
  return rawList.map((item: any) => {
    return {
      label: item.name,
      value: item.name,
      key: item.id,
    }
  })
}
export const getFilter = (rawList: any) => {
  return rawList.map((item: any) => {
    return {
      text: item.name,
      value: item.name,
    }
  })
}

export const mutiSearch = (s: string, t: string) => {
  const source = (s as string).toLowerCase();
  const target = t.toLowerCase();
  const rawInclude = source.includes(target);
  const pinYinInlcude = Boolean(pinyin.match(source, target));
  return rawInclude || pinYinInlcude;
};