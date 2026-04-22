# План обновления deprecated-зависимостей

## Контекст
- `npm audit fix` уже применен безопасно (без `--force`), уязвимости закрыты.
- Deprecated-пакеты остаются техническим долгом и требуют отдельного контролируемого обновления.

## 1) Прямые зависимости (обновлять в первую очередь)

### `eslint@8.57.1` (direct, deprecated)
- Сейчас используется как прямой `devDependency` в `package.json`.
- Рекомендуемый вектор: обновление до актуальной мажорной версии `eslint@9`.
- Риск: возможные breaking changes в конфиге, правилах и совместимости экосистемы.
- План:
  1. Создать отдельную ветку (`chore/eslint9-upgrade`).
  2. Обновить `eslint` + совместимые версии `@typescript-eslint/*` и airbnb-конфигов.
  3. Прогнать `npm run lint` и устранить конфигурационные/правиловые несовместимости.

## 2) Транзитивные deprecated-зависимости

### Группа A: цепочка через ESLint
- `@humanwhocodes/config-array@0.13.0` -> deprecated
- `@humanwhocodes/object-schema@2.0.3` -> deprecated
- `rimraf@3.0.2` -> deprecated
- `glob@7.2.3` -> deprecated
- `inflight@1.0.6` -> deprecated
- Источник: текущий стек `eslint@8`.
- Стратегия: не обновлять вручную транзитивы; они должны уйти после миграции на современный стек ESLint.

### Группа B: цепочка через jest/jsdom
- `whatwg-encoding@3.1.1` -> deprecated
- `glob@10.5.0` -> deprecated warning в текущем дереве `jest`.
- Источник: `jest@30`, `jest-environment-jsdom`, связанные пакеты.
- Стратегия: обновлять верхнеуровневые `jest`-пакеты до свежих patch/minor, затем переснять lockfile.

## 3) Порядок выполнения (risk-first)
1. Миграция `eslint`-стека (убирает самый большой хвост deprecated-транзитивов).
2. Patch/minor обновление `jest`-стека.
3. Полная переустановка (`rm -rf node_modules && npm ci`) и повторная проверка предупреждений.
4. Финальный прогон quality gates:
   - `npm run lint`
   - `npm run format:check`
   - `npm run lint:css`
   - `npm run build`
   - `npm run test`

## 4) Критерии готовности
- `npm install`/`npm ci` не выводит критичных deprecated-цепочек из прямых зависимостей.
- Оставшиеся deprecated-предупреждения (если есть) только транзитивные, задокументированы и контролируются через обновление верхнеуровневых пакетов.
- Все quality gates проходят.
