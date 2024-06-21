import compact from 'just-compact';

export function joinPath(...paths: string[]) {
  return compact(paths)
    .map((path) => path.replace(/^\/+/, '').replace(/\/+$/, ''))
    .join('/');
}

export function normalizePath(path: string) {
  return compact(path.split('/')).join('/');
}
