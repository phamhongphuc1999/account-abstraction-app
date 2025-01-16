## Account Abstraction App

<div>
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Feather.png" alt="Feather" width="40" height="40" />
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bug.png" alt="Bug" width="40" height="40" />
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Feather.png" alt="Feather" width="40" height="40" />
</div>

### Usage <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dove.png" alt="Dove" width="25" height="25" />

- Install packages

```shell
bun install
```

- Build typechain

```shell
bun typechain:build
```

- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Deer.png" alt="Deer" width="25" height="25" /> Run app

```shell
bun dev
```

### Note

- My app is just temporary version and personally i am having many thing must be handled. Below, i list some important note if you wish run my app

- 1. While you are creating your guardian account, please ensure your password is 1111. Please don't be wonder, i just hardcode password be 1111.

### Guardian account for test

##### You only need private key to import a BabyJubJub key pair.

- Key pair 1

  - private key: `9e748c64efaeada22d5884984e57e156ed89bf9aabdeead29ed1d4b9a769bea4`
  - public key: `0x1fcd271f0f46f55a2e9aa8f6aa6bc940811caefde356fca36155d05bd858c37a`
  - poseidon hash: `0x7f2de775b5304deb2a93502ad7737adac830e14bb8a10c0bce11a9498a21695`

- Key pair 2

  - private key: `11a266788cd4fced86776079ac7043278ef290b01b17a1459b701fe3cd5940ec`
  - public key: `0x9375caf523af313938ee18dd8ec14caba1edd2f29e4515b07e632f7d05708dd2`
  - poseidon hash: `0x113a2ec56bd70830029dce630efe93b11573cbae07f732a9065f8613e26dcb15`

- Key pair 3

  - private key: `45b22e3a4f85dd9ae6ee85814943e6752696f13695f32e20cd99176ba1026ba7`
  - public key: `0x91a222e0c9ccc9859cafd677b6f524352f724121634669342d4f11f829f0ab85`
  - poseidon hash: `0xa7718252ed6cd0a9b6ee5e4b329725af5a892abd4d4592420ed5d77b9699e7f`

### Reference

- https://github.com/Electron-Labs/ed25519-circom/blob/main/circuits/verify.circom
