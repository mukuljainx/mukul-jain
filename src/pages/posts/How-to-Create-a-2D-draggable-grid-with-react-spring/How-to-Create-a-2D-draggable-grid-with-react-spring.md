---
slug: "/blog/How-to-Create-a-2D-draggable-grid-with-react-spring"
date: "2021-05-29"
title: "How to Create a 2D draggable grid with react-spring"
preview: "Spread operator is great, but does it have any downside? Let's check it out with different looping methods."
---

In this article we will create a 2D grid were each item can be dragged and moved to a different place, [quick demo](https://gbdgu.csb.app/).

<iframe src="https://codesandbox.io/embed/2d-draggable-list-gbdgu?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="2d-draggable-list"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

We will be writing most of the things from scratch to see how things work under the hood but will be using react-spring to animate because it takes the animation out of React for performance reasons! don't worry logic will be still ours, though you can surely remove react-spring out of the picture and use something else or just React ;) , we will see it at the end.

What we will cover

1. Creating a single draggable block
2. Creating 2D blocks layout with custom hook useDraggable [Before 2nd June]
3. Rearranging blocks using react-spring [Before 6th June]

# Creating a single draggable block

What is a draggable block? block which moves with the mouse pointer, when the mouse key is pressed until the pressure from the key is released.

There are 3 events involved here

1. Mouse key/track-pad is pressed i.e. `mouseDown`
2. Mouse is moved hence the pointer moves i.e. `mouseMove`
3. The pressure is released i.e. `mouseUp`

`mouseDown` will give us the initial coordinates, on each `mouseMove` this will be fired whenever there is a movement even for 1px will give us the accurate path and `mouseUp` will give us the ending coordinates. Our block (it can be anything, div, image etc.) have to move with the mouse, so we will bind appropriate methods with the mouse events.

Let's create a block, we will using typed code using [Typescript](https://www.typescriptlang.org/), if you are not familiar with it, don't worry just ignore things like `IProps` or `type` these doesn't effect anything at runtime.

```tsx
import * as React from "react";
// For CSS in JS
import styled from "styled-components";

const BlockWrapper = styled("div")`
  position: relative;
  border-radius: 4px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  width: 120px;
  background: red;
`;

const StyledText = styled("p")`
  color: white;
  font-weight: 600;
  font-size: 24px;
`;

const Block = () => {
  return (
    <BlockWrapper>
      <StyledText>1</StyledText>
    </BlockWrapper>
  );
};

export default Block;
```

Great we have a static block now let move it. Let's apply `mouseDown` to our block. Before jumping to actual code, let's try to derive the calculation needed.

> Block Initial Coordinates: [0,0]

> Pointer Initial Coordinates: [10,2] (when `mouseDown` was fired)

> Pointer Final Coordinates: [110,102] (when `mouseUp` was fired)

> Pointer Movement= Final-Initial: [100, 100]

> **Block Coordinates = [Block Initial Coordinates + Pointer Movement]**

Now block may have some initial coordinates, but that will be covered as we are adding the difference to it.

```jsx
const Block = () => {
  const [coordinate, setCoordinate] = React.useState({
    block: {
      x: 0,
      y: 0,
    },
    pointer: { x: 0, y: 0 },
    dragging: false,
  });

  const handleMouseMove = React.useCallback(
    (event) => {
      if (!coordinate.dragging) {
        return;
      }
      const coordinates = { x: event.clientX, y: event.clientY };

      setCoordinate((prev) => {
        const diff = {
          x: coordinates.x - prev.pointer.x,
          y: coordinates.y - prev.pointer.y,
        };
        return {
          dragging: true,
          pointer: coordinates,
          block: { x: prev.block.x + diff.x, y: prev.block.y + diff.y },
        };
      });
    },
    [coordinate.dragging]
  );

  const handleMouseUp = React.useCallback(() => {
    setCoordinate((prev) => ({
      ...prev,
      dragging: false,
    }));
  }, []);

  const handleMouseDown = React.useCallback((event) => {
    const startingCoordinates = { x: event.clientX, y: event.clientY };
    setCoordinate((prev) => ({
      ...prev,
      pointer: startingCoordinates,
      dragging: true,
    }));
    event.stopPropagation();
  }, []);

  return (
    <BlockWrapper
      style={{ top: coordinate.block.y, left: coordinate.block.x }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <StyledText>1</StyledText>
    </BlockWrapper>
  );
};
```

Try it [here](https://uequ3.csb.app/).

<iframe src="https://codesandbox.io/embed/sharp-meitner-uequ3?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="singal-block"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

That's all for today! Next up we will move our code responsible for dragging into a hook and will create a 2D layout.

It should be noted there are many libraries which provides hook out of the box for dragging, one is `use-gesture` which works seamlessly with `react-spring` and also takes dragging out of React, giving a little performance boast. Though we will not be covering it here as our target is to learn the basics.
