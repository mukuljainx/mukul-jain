---
slug: "/blog/Smart-Grid-A-Lightweight-virtualized-grid"
date: "2020-03-08"
title: "Smart Grid: A Lightweight virtualized grid."
preview: "Journey from scroll able div to virtualized pinned grid."
---

> Live Demo: [Smart Grid](https://mukuljainx.github.io/smart-grid/)

There are penality of React tables, everyone got its pros and cons but they all are pretty heavy, they all have almost the same features and few outstanding features and then there is [ag-grid](https://www.ag-grid.com/) full of awesome feature but it is pretty heavy half of our vendor bundle was ag-grid ~ 200kb (gzipped 😱).

Okay so change the table, right? but there is no another package which provides the pinning feature so well, in most of the package, the tables scroll goes out of sync due to prioritization in JS. One fine Saturday it clicked me what if those two tables don’t have different vertical scroll but they are inside one container which is scrollable and they have different horizontal scrolls. Obviously the height of the tables will be the same, so scroll will always be in sync.

Something like this:

```jsx
<div
  style={{
    height: 500,
    width: 700,
    border: "1px solid",
    display: "flex",
    overflow: "auto",
  }}
>
  <div
    style={{
      height: 2000,
      width: 400,
      border: "1px solid red",
      flexShrink: 0,
    }}
  />
  <div
    style={{
      height: 2000,
      width: 800,
      border: "1px solid blue",
      flexShrink: 0,
    }}
  />
</div>
```

If you will run this code you will both **div**’s are in sync vertically but the whole container is scrolling horizontally, but we want our unpinned table, i.e. right one for now to scroll, how to solve that? Simply add the right table inside a div with `overflowX:auto`, something like:

```jsx
<div
  style={{
    height: 500,
    width: 700,
    border: "1px solid",
    display: "flex",
    overflow: "auto",
  }}
>
  <div
    style={{
      height: 2000,
      width: 400,
      border: "1px solid red",
      flexShrink: 0,
    }}
  />
  <div style={{ overflowX: "auto" }}>
    <div
      style={{
        height: 2000,
        width: 800,
        border: "1px solid blue",
        flexShrink: 0,
      }}
    />
  </div>
</div>
```

## Working Demo

<iframe src="https://codesandbox.io/embed/sad-kilby-0y4pl?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="virtualized-table"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Major Problem Solved 🎉 then I inspected ag-grid demo page to check what they do and voila, they are doing almost the same thing.

Cool! but what about virtualization?

## Virtualization

I am very lazy and hate reinventing the wheel, so I searched for packages which provide virtualization and found some, so I tried using them with the above code, the result was something like this, refer to table with **virtual table** heading. The package I used is **react-tiny-virtual-list** which obviously is not at fault, it is doing what it is supposed to.

<iframe src="https://codesandbox.io/embed/table-virtual-j1o8u?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="table-virtual"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

There is one more table there, below that one is also virtualized else tab will be hanged with large data, so how I achieved it, by calculating current position using `**scrollOffset`\*\* then calculating a start & end position something like

```jsx
const start = Math.max(position - buffer - visibleCount, 0);
const end = Math.min(position + buffer + visibleCount, data.length - 1);
```

Then just rendering just those rows, It was not expected to go fine in one go as I didn’t think virtualization was this simple, but that is what it is! 🙅‍♂️

I also tried using fast-memoize to memoize rows so they won’t be recalculated thus saving some work which results in smooth scrolling experience but page started crashing for the huge data set due to increased JS heap size.

I went through react-virtualized to what they have done and I found very amazing thing there, cache while scroll and clear it when scroll stops. Create a local cache always look for grid row in the cache first if not create row & cache it. Assign an empty object to the cache when the user stops scrolling.

## Dynamic Height

Dynamic height is also supported in version `v0.1.0` , this is achieved by rendering rows twice once for getting the height of the row at some fixed position and the second time with calculated height & positions, these values are cached so when the user scrolls to the previously viewed rows they are only rendered once as we already have their height and position stored in cache.

When data changes for any row, recalculation may be needed but this has been left user by providing `gridActions` as the user can predict when the height may change and the cache will not be cleared every time the data changes. You view the live demo at [https://mukuljainx.github.io/smart-grid/](https://mukuljainx.github.io/smart-grid/)

That’s how [smart-grid](https://mukuljainx.github.io/smart-grid/) came to existence, it’s an open-source project please open a PR or issue if needed on [Github](https://github.com/mukuljainx/smart-grid). 😇
