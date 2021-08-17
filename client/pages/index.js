import buildClient from '../api/buildClient';

const LandingPage = ({ currentUser }) => {
  console.log('props', currentUser);
  return <h1>Landing Page</h1>;
};

// render component with data during server-side rendering process
LandingPage.getInitialProps = async context => {
  const { data } = await buildClient(context).get('/api/uers/currentuser');
  return data;
};

export default LandingPage;
