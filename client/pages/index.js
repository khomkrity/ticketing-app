const LandingPage = ({ color }) => {
  console.log('component', color);
  return <h1>Landing Page</h1>;
};

// render component with data during server-side rendering process
LandingPage.getInitialProps = () => {
  console.log('server-side rendering');
  return { color: 'red' };
};

export default LandingPage;
