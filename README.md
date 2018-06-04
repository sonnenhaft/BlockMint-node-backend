# BlockMint-node

## Install

1. Install redis
In mac ```brew install redis```

2. Install nodejs and dependencies:
In mac ```brew install node```
For dependencies: ```npm install```

## Run dev

When you extend app, on every change app will reload itself.

```npm run dev```

## Run prod

```/root/wallet-server-node/nvm exec 8.9.2 npm run start```

## Server port and redis url

Right now app will be launched on port 3002, and will look for local redis on port 6379.
Later it will be configurable via environment variables.


