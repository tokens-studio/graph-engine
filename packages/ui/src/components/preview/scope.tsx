import react from 'react';
const OutputContext = react.createContext({});
import React from 'react';

export const OutputProvider = ({ children, value = {} }) => {
  return (
    <OutputContext.Provider value={value}>{children}</OutputContext.Provider>
  );
};

const useTokens = (subSelector?: string) => {
  const ctx = react.useContext(OutputContext);

  //@ts-ignore
  let vals = ctx.output || {};

  if (subSelector) {
    vals = vals[subSelector] || {};
  }
  return vals;
};

const useTokenProps = (subSelector?: string) => {
  const styles = useTokens(subSelector);

  return {
    style: styles,
  };
};

export const scope = {
  useTokens,
  useTokenProps,
};

export const code = `const Example = () => {
    /* The parameter inside useTokens maps to the name of your Output node parameters. The CSS Map node lets you connect to any css property, but you can also just pass in any other output, for example a string or a color value. */
    const cardCSSMap = useTokens('card');
    const titleCSSMap= useTokens('title');
    const textCSSMap= useTokens('text');

    return (<div style={cardCSSMap}>
              <h2 style={titleCSSMap}>Dynamic preview</h2>
              <p style={textCSSMap}>Create an Output node and connect the code in this example to it by using the useTokens hook and see the preview change in real time. Change the code used for this preview to customize it to your liking. This is saved when you save your .json</p>
        </div>);
}

render(<Example/>)
`;
