---
slug: "/blog/React-useEffect-The-basics-and-the-secrets"
date: "2021-06-04"
title: "React useEffect: The basics and the secrets"
preview: "React useEffect Wikipedia ;)"
---

Almost everyone is familiar with hooks these days, `useEffect` is one of the most used hook. My 2 cents on it!

It's a hook which triggers after each render to perform any side effect.

### Simple useEffect

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  document.title = count;
});
```

Whenever the components re-render the hook will trigger updating the document title. It might be due to count change or its parent might have re-rendered causing this to re-render.

### The Cleanup Method

If you are creating side effect, you might want to clear them like clearing `timeout` or cancelling previous pending API request, for this we have cleanup method, return a function from useEffect and it will trigger at unmount or before the next cycle of the same useEffect.

```jsx
const [count, setCount] = useState(0)

useEffect(() => {
  // Not a good practice, just for the sake of example
  document.body.style.background = 'blue'
    return () => {
      document.body.style.background = 'red'
    };
})

...

<button onClick={() => setCount(count+1)}>Count ++</button>

```

Most people learn `useEffect` by relating it to `componentDidMount`, `componentDidUpdate` and `componentWillUnmount`. So they relates the cleanup function with `componentWillUnmount` and thinks all cleanup are triggered only once, on unmount. Which is far from the truth! whenever I asked this question in interview only answer I got was "in the unmount phase"

After the first render `useEffect` will trigger and we can see background color as red and when the state changes the component will re-render hence `useEffect` will trigger again after the render but before that, cleanup method will trigger as shown in this gif.

![useEffect Demo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1jztqyinu64nemgjhwyk.gif)

**Why?**: To keep the concern limited at one place, Assume cleanup doesn't run before every useEffect and let's say you are using `setTimeout` in the `useEffect`, if there is second `useEffect` call you have to cancel the first timer or there might be a memory leak, a possible way to do it is

```jsx
const timer = React.useRef(null);

useEffect(() => {
  if(timer.current){
    clearTimeout(timer.current);
  }

  timer.current = setTimeout(...
})
```

but with a cleanup function you can do

```
useEffect(() => {
  const timer = setTimeout(...

  return () => {
    clearTimeout(timer);
  }
})
```

### Optimize using the dependency array

There might be a case where you don't want it to run the useEffect on specific condition for this useEffect (all the hooks) have another parameter known as dependency array, where you can specify the dependent parameter like `[count]`, useEffect will trigger only if `count` changes and cleanup method too.

### Empty dependency array

Is it a special case for `componentWillunmount` and `componentDidMount`? Nope, though it seems like but it is not handled separately.

```
useEffect(() => {
  ...
  return () => {...}
}, [])
```

`[]` means no dependency, so useEffect will trigger only during the initial render and cleanup only in unmount phase, React calls all cleanup methods in unmount phase hence it will run, so it behaves same way as `componentWillunmount` and `componentDidMount` but it's not the same.

Last but not least due to closure cleanup will have values of previous state when `useEffect` was executed.

You can try `useEffect` [here](https://codesandbox.io/s/understanding-use-effect-hx83v)
