import react from 'react';
const OutputContext = react.createContext({});

export const OutputProvider = ({ children, value = {} }) => {
  return (
    <OutputContext.Provider value={value}>{children}</OutputContext.Provider>
  );
};

const useTokens = (selector: string, subSelector?: string) => {
  const ctx = react.useContext(OutputContext);

  if (!selector) {
    return ctx;
  }

  let vals = ctx[selector] || {};

  if (subSelector) {
    vals = vals[subSelector] || {};
  }
  return vals;
};

const useTokenProps = (selector: string, subSelector?: string) => {
  const styles = useTokens(selector, subSelector);

  return {
    style: styles,
  };
};

export const scope = {
  useTokens,
  useTokenProps,
};

export const code = `const Example = () => {

    const cardStyle = useTokens('Card','container');
    const cardImageStyle = useTokens('Card','image');
    const cardContent= useTokens('Card','content');
    const cardTitle= useTokens('Card','title');


    return (<div class="card" style={cardStyle}>
            <img src="https://images.unsplash.com/photo-1684395521046-fe664a85a9e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60" alt="Card Image" style={cardImageStyle} />
            <div style={cardContent}>
                <h2 style={cardTitle}>Card Title</h2>
                <p >This is a sample card description.</p>
                {/* This is a web component provided by lion but wrapped in a token provider. Use'scope=<NAME>' to change the listed scope from  its default 'Button'  */}
                <wc-button>Read More</wc-button>
            </div>
        </div>);
}
render(<Example/>)

`;
