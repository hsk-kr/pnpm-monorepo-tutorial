# React Monorepo Setup Tutorial with pnpm and Vite: React project + UI, Utils

Last evening, I found an error on the docs of `chakra-ui`, which I have recently been using on my personal project. I forked the project and I tried to find the error. The project was set up as a monorepo and it looked very intriguing because I wanted to try to set up a monorepo someday. I even wrote it down on my todo list, but I didn't have an opportunity where I needed to set up a monorepo. Anyway, I didn't find the error and went to bed. I woke up a couple of hours late. I was supposed to sleep. It was three in the morning. But I couldn't fall asleep again from thinking of the mono repo structure. After some minutes, I just got out of bed and started to work on setting up the mono repo using pnpm.

What I wanted to implement are the following:

- Creating two packages for UI components and Util functions that can be used from a separate React project.
- Creating a React project and using the two packages in the React project.
- Running testing for each project.
- Installing all dependencies, running the dev server, and testing for each workspace from the root directory.

As implementing those things is the main goal for this mono repo, common configurations, package.json, and small details were not considered.

There might be many things you should consider in the real world, and that could be also different depending on various factors.

I will be writing this post following the steps:

1. [Root project](#root-project)
2. [website](#website)
3. [packages/utils](#packagesutils)
4. [packages/ui](#packagesui)
5. [Using packages on the website](#using-packages-on-the-website)
6. [Wrap up](#wrap-up)

Additionally, I have recorded the process and uploaded it on my youtube channel. Since I started this channel to practice speaking English, considering my English proficiency, some I said might not sound unnatural. But still, I suggest watching the video if you would like to see the process in more detail. It's a very pure no-edit video where you can see all I did to set up a mono repo, like what I searched for, what problems I encountered, and how I solved them from scratch.

Okay, let's get started!

---

## Root project

1\. Create a folder and initialize pnpm

```properties
> mkdir monorepo
> cd monorepo
> pnpm init
```

2\. Create `pnpm-workspace.yaml` file and set up the workspace paths

```yaml
packages:
  - 'packages/*'
  - 'website'
```

---

## website

1\. Set up a React project using `Vite`

```properties
> pnpm create vite
```

![pnpm create vite output in the terminal](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gzyx53efug7rkasy999b.png)

2\. Install packages

```properties
> pnpm install
```

Install the dependencies from the root directory.

![pnpm install output](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tdsrdvum3q3w02km62z0.png)

![pnpm-lock.yaml and the contents](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gnqv02hpv9v54l41p2tb.png)

It will detect the workspaces and create a `pnpm-lock.yaml` in the root directory. In the lock file, dependencies are written under the package name `website`.

3\. Add a script to run the dev server from the root directory

```javascript
//...
"scripts": {
  "dev": "pnpm --filter website dev"
},
//...
```

Add a script into the `package.json` file of the root directory.

The [`--filter`](https://pnpm.io/filtering) option allows us to execute a script under the `website` workspace.

4\. Run the `dev` command to see if the dev server is sucessfully started with the command

```properties
> pnpm run dev
```

![Vite project initial page](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6qge9rtz97tknfajsf42.png)

Open the `http://localhost:5173`, and you will see the initial page.

---

## packages/utils

1\. Create the `utils` directory under the `packages`.

```properties
> mkdir -p packages/utils
```

2\. Create `package.json`

```javascript
{
  "name": "@mono/utils",
  "version": "0.0.1",
  "main": "src/index.ts",
  "scripts": {
  }
}
```

The package has been renamed with `@mono/utils` and set the main file path.

3\. Set up typescript environment

```properties
> pnpm install -D typescript --filter utils
> pnpm exec tsc --init
```

4\. Create a function in a file

![add function in the calc file](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fnha5vmhntq65dlfe7wj.png)

Don't forget to export the function from the `index.ts`.

5\. Set up `vitest` and write test code

```properties
>  pnpm install -D vitest --filter utils
```

[packages/utils/src/calc.test.ts]

```typescript
import { test, expect } from 'vitest';
import { add } from './calc';

test('add(10, 20) should return 30', () => {
  expect(add(10, 20)).toBe(30);
});
```

6\. Add a test script in the `package.json` files.

[packages/utils/package.json]

```javascript
{
//...
  "scripts": {
    "test": "vitest run"
  },
//...
}
```

[package.json]

```javascript
{
//...
  "scripts": {
    "dev": "pnpm --filter website dev",
    "test:all": "pnpm -r test"
  },
//...
}
```

The [`-r`](https://pnpm.io/cli/run#--recursive--r) option will execute the test command for each workspace.

7\. Test

```properties
> pnpm run test:all
```

![test:all command output](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yxsyn6mek3nqz5dsi7qo.png)

---

## packages/ui

1\. Set up the `ui` package using `Vite`.

```properties
> cd packages
> pnpm create vite
```

![create a react project using vite](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/83095jssfvfrbsg50xjz.png)

As the `ui` package was created by `Vite`, unnecessary files that you may not need to implement UI components will come with it together. I used `Vite` to set it up quickly though, you can set the `ui` package up by yourself. That would be more appropriate as you can install specific dependencies and configures you need.

2\. Delete unnecessary files

- All the files under the `src` dir
- index.html
- public dir

![UI dir structure after deleting all the unnecessary files](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4u07gvm2a7pr5amcbdrl.png)

3\. Install dependencies

```properties
> pnpm install
```

![output from a command pnpm install](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2rywmqmslj8kzvi2o1pd.png)

4\. Create a component

[packages/ui/src/Button.tsx]

```typescript
import { ComponentProps } from "react";

const Button = (props: ComponentProps<'button'>) => {
  return (
    <button {...props} />
  )
}

export default Button;
```

[packages/ui/src/index.ts]

```typescript
export { default as Button } from './Button';
```

5\. Set up test environment with `vitest` and `react-testing-library`.

```properties
> pnpm add -D --filter ui @testing-library/jest-dom vitest jsdom @testing-library/react
```

[packages/ui/vitest.config.ts]

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    conditions: mode === 'test' ? ['browser'] : [],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
  },
}));
```

[packages/ui/vitest-setup.js]

```typescript
import '@testing-library/jest-dom/vitest';
```

[packages/ui/tsconfig.json]

```javascript
{
//...
    "types": ["@testing-library/jest-dom"],
//...
}
```

`import '@testing-library/jest-dom/vitest';` from the vitest-setup.js enables you to use jest-dom functions such as `toBeInDocument` with `vitest`.

Additionally, to see the proper types, you should add the jest-dom type in the `types` field.

6\. Write test code

[src/packages/ui/Button.test.tsx]

```typescript
import { test, expect} from 'vitest';
import { render, screen} from '@testing-library/react'
import Button from './Button';

test('Button shuold be rendered', () => {
  render(<Button>Hello</Button>);

  expect(screen.getByText(/Hello/)).toBeInTheDocument();
});
```

7\. Add a test script

[src/packages/ui/package.json]

```javascript
{
  "name": "@mono/ui",
  "main": "src/index.ts",
//...
  "scripts": {
    "test": "vitest run"
  },
//...
}
```

The package has been renamed with `@mono/ui` and set the main file path.

8\. Run test:all

![the result of the test:all command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g54xm7w3orgsejwwvlqx.png)

---

## Using packages on the website

1\. Add dependencies in package.json

[website/package.json]

```javascript
{
//...
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mono/ui": "workspace:*",
    "@mono/utils": "workspace:*"
  },
//...
}
```

2\. Install dependencies

```
pnpm install
```

3\. Write code

[website/src/App.tsx]

```typescript
import { ChangeEvent, useState } from 'react'
import { Button } from '@mono/ui';
import { add } from '@mono/utils';

function App() {
  const [nums, setNums] = useState({
   a: '',
   b: '',
  })

  const handleNumChange = (key: keyof typeof nums) => (e: ChangeEvent<HTMLInputElement>) => {
    setNums(prevNums => ({
      ...prevNums,
      [key]: e.target.value,
    }));
  };


  return (
    <div>
      <input type='text' value={nums.a} onChange={handleNumChange('a')} />
      <input type='text' value={nums.b} onChange={handleNumChange('b')} />
      <Button onClick={() => {
        alert(add(Number(nums.a), Number(nums.b)));
      }}>Add</Button>
    </div>
  )
}

export default App
```

4\. Result

![Result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rilbhcwpldnzage4kege.png)

---

## Wrap up

Explore some mono repos, you will get an idea of how you should set your project. husky, common setting of tsconfig file, etc, there are many things you can set up with and also you need to consider such as versioning, dependencies, and so on.

I hope you found it helpful and Happy Coding!
