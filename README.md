# Account Abstraction App

### Usage

- Install packages

```shell
bun install
```

- Build typechain

```shell
bun run typechain:build
```

- Run app

```shell
bun run dev
```

### Config

- 0x3a6ab525c27e7dcd92ec22738d03bc996c464c95

export const DefaultGasOverheads: GasOverheads = {
fixed: 21000,
perUserOp: 18300,
perUserOpWord: 4,
zeroByte: 4,
nonZeroByte: 16,
bundleSize: 1,
sigSize: 65,
};
