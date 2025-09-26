export const config = {
  parent_id: {
    html: "div",
    className: "parent",
    textContent: "parent div",
    children: {
      child_id: {
        html: "p",
        className: "child",
        textContent: "child div",
        children: {
          grandchild: {
            html: "span",
            textContent: "hellow world",
            className: "grandchild",
          },
        },
      },
    },
  },
};
