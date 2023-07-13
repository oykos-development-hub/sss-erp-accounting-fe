# SSS ERP system

## Accounting micro-service

This project represents a container for all the client applications that are part of the SSS ERP system.
It imports other micro-service based front-end repos and loads them into related ares of the client application.
This application communicates with the BE regarding all the system based operations, such as authentication, authorization, permissions, etc.
It renders other FE micro-services as child components and passes properties down to them.

### Setup

- Create `.env` file in the root of the project with following content:

```
VITE_PORT=3004
GITLAB_CLIENT_LIBRARY=gitlab.sudovi.me/erp/storybook.git
GITLAB_USER=${YOUR_GITLAB_USERNAME}
GITLAB_PAT=${PERSONAL_ACCESS_TOKEN}
```

- Run the command `npm run setup` in order to install all required `node_modules` (**NOTE: Don't run `npm install` as it's contained within `setup` command**)
- Run command `npm run prepare` in order to set up Husky commands for pre-commit and pre-push
- Make sure you have exactly the same NodeJS version that's noted in the file `.node-version` by running command `node -v`
- If you don't have that version of NodeJS installed, install it manually from the official website, or by using NVM - https://github.com/coreybutler/nvm-windows/releases/download/1.1.10/nvm-setup.exe

### Development

Branches are created only from `development` branch, after pulling the latest changes.

`develop` branch is merged to `main` only when the code is ready to be bundled and released.

- To run app locally you first need to run command `npm run dev`

_Open [http://localhost:3000](http://localhost:3000) with your browser to see the result._

_This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font._

#### Branch naming convention

1. state the type of change you are making: `build, fix, refactor, feat`
2. add forward slash `/`
3. state the task ID (if applicable) - TSK-123
4. add 2-3 words separated by `-` that describe changes you are making
5. Example: `fix/TSK-123-fixing-border-radius`

#### Commit & Push

We use the same convention as for Branch naming.

Only difference is that we use `:` instead of `/` in the commit message. And we describe in the message what we did without `-` between words.

Example: `fix: changed border radius from 4px to 2px`

**NOTE #1**: When you want to make commit, please run `npm run git:commit` if it's not run automatically by Husky for any reason.

**NOTE #2**: When you want to push the branch, please run `npm run git:push` if it's not run automatically by Husky for any reason.

This ensures we use the same style of writing code and thus avoid unnecessary styling changes and merge issues.

#### File and component naming

When creating new files and components, please make sure that the name is as precise as to what the file/component represents, and avoid making the name too long.

Camel case should be use for files: `employeeModal.tsx` and pascal case for components: <EmployeeModal />.

#### Pages and components

`pages` folder is where the pages are located. Each page will have a folder containing a `index.tsx` file which is the root page. Next to it, there will be folders for individual sub pages, e.g different tabs which are all different routes in the employees page. Each of the page components will have a `styles.ts` inside its folder, where the styled components for each component should be located.

Root file, the `index.tsx`, should hold the router for that specific screen with the components that render on each individual sub route. Each page folder will also contain `constants.ts` and `types.ts` which will only contain constants/types that appear in that page and nowhere else. Example of the pages file tree:

```bash
├── pages
│   ├── employees
│   │   ├── index.tsx
│   │   ├── employeesRouter.tsx
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   ├── education
│   │   │   ├── Education.tsx
│   │   │   ├── styles.ts
│   │   ├── experience
│   │   │   ├── Experience.tsx
│   │   │   ├── styles.ts
```

`components` will contain the components. It will be split into `containers` and `ui`. `containers` will hold the reusable styled component 'wrappers', such as a generic <Container /> or <Box />. `ui` on the other hand will contain the bulk of the components used in the application. Each of the components will have its `styles.ts` with styled components for that component.

#### Some other tips on the coding style:

- Put all your modals at the bottom of the render block
- If there is a utility function you need to use in one place, place it in the `utils` folder if it's something that can be reused
