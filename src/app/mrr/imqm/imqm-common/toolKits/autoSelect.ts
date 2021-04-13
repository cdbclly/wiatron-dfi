import { SelectItems } from './model';

export function setSelectLocal(subject: string, item) {
  const selectItems = JSON.parse(localStorage.getItem('$IMQM$selectItems')) ? JSON.parse(localStorage.getItem('$IMQM$selectItems')) : {};
  selectItems[subject] = item;
  localStorage.setItem('$IMQM$selectItems', JSON.stringify(selectItems));
}

export function getSelectLocal(subject: string) {
  return JSON.parse(localStorage.getItem('$IMQM$selectItems'));
}

export function assignObjectEmpty(object: SelectItems, keys: string[]) {
  object = object ? object : new SelectItems();
  keys.forEach(key => {
    object[key] = undefined;
  });
  return object;
}
