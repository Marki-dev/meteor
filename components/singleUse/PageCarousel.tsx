import React, { ReactNode } from "react";

interface Props {
  children: (next: () => void) => ReactNode[];
}

const PageCarousel: React.FC<Props> = ({ children }) => {
  const [state, setState] = React.useState(0);

  function next() {
    setState((state + 1) % children.length);
  }

  return <>{children(next)[state]}</>;
};

export default PageCarousel;
