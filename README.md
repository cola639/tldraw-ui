# How to start

```bash
node 16.x
rm -rf node_modules pnpm-lock.yaml && pnpm store prune && pnpm install
```

```bash
pnpm run dev
Serve with hot reload at <http://localhost:5173>.
```

TODO:
1 创建房间
2 分享房间 后端检测该房间成员members是否包含对方
3 公开类型 输入房间号加入 加入成员不能超过5人
4 搜索

![reactjs-vite-tailwindcss-boilerplate](https://user-images.githubusercontent.com/16243531/217138979-b854309c-4742-4275-a705-f9fec5158217.jpg)

# React Tailwindcss Boilerplate build with Vite

This is a boilerplate build with Vite, React 18, TypeScript, Vitest, Testing Library, TailwindCSS 3, Eslint and Prettier.

## What is inside?

This project uses many tools like:

- [Vite](https://vitejs.dev)
- [ReactJS](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Vitest](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [Tailwindcss](https://tailwindcss.com)
- [Eslint](https://eslint.org)
- [Prettier](https://prettier.io)

## Getting Started

### Install

Create the project.

```bash
npx degit joaopaulomoraes/reactjs-vite-tailwindcss-boilerplate my-app
```

Access the project directory.

```bash
cd my-app
```

Install dependencies.

```bash
pnpm install
```

Serve with hot reload at <http://localhost:5173>.

```bash
pnpm run dev
```

### Lint

```bash
pnpm run lint
```

### Typecheck

```bash
pnpm run typecheck
```

### Build

```bash
pnpm run build
```

### Test

```bash
pnpm run test
```

View and interact with your tests via UI.

```bash
pnpm run test:ui
```

## License

This project is licensed under the MIT License.
