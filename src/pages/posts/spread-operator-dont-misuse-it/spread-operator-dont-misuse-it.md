---
slug: "/blog/spread-operator-dont-misuse-it"
date: "2021-05-28"
title: "Spread Operator: don't misuse it"
preview: "Spread operator is great, but does it have any downside? Let's check it out with different looping methods."
---

Spread operator was introduced with JavaScript ES6 along with other great features, but with great power comes the great responsibility. Mostly it is used to create a new reference to object or an array, though it only copies one level deep it's pretty useful especially where we cannot mutate object like React or Redux state, though we are not creating a whole new object, it gets the work done.

Great! What's the issue then? Enough talk let's write some code, We will be using a user array for this purpose and will create a map of active users. Let's define a simple User interface before jumping to real problem.

```ts
interface IUser {
  active: boolean;
  name: string;
  id: string;
}

const users = []; // 10,000 users
```

#### Case 1

```ts
const activeUsers = users.reduce((acc, user) => {
  if (user.active) {
    return { ...acc, [user.id]: user };
  }
  return acc;
}, {});
```

#### Case 2

```ts
let activeUsers = {};

users.forEach((user) => {
  if (user.active) {
    result[user.id] = user;
  }
});
```

#### Case 3

```ts
const a = users.filter((user) => user.active).map((user) => [user.id, user]);
const activeUsers = Object.fromEntries(a);
```

Can you arrange according their performance? from best to worst.

<details>
<summary>Check actual stats!</summary>
  
### Result
1. Case 2 
2. Case 3 (~63% slow)
3. Case 1 (~86% slow)
Checkout all test cases here: [JS Bench](https://jsbench.me/9zkp8n3nkd/1)

</details>

## Let's dive in

No surprise case 2 was fasted, just plain loop with simple key value addition.

Case 3 was expected to be slow as it has to iterate the array twice that should slow it down and now we have an idea by what margin so avoid it.

Case 1 was not expected to be this slow as it's similar to case one with builtin method, there is one thing which might be slowing it down, `reduce` internal implementation!

Nope, it's the **spread operator**, in general it's slower then adding a key-pair to object but that doesn't mean avoid it just use it only if required. In the case 1 anyway we will get a new `object` from the `reduce` using spread operator is totally unnecessary. Change it to

```ts
const activeUsers = users.reduce((acc, user) => {
  if (user.active) {
    acc[user.id] = user;
  }
  return acc;
}, {});
```

and it is almost at par with `forEach` one, 1% slower.

We might have developed a habit of always using spread operator to avoid uncalled bugs in daily life especially with React and it might not be degrading the performance much but it can, in some cases like this one, so let's remember this, might come handy one it.
