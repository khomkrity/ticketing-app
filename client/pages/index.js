import buildClient from '../api/buildClient';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>;
};

// render component with data during server-side rendering process
LandingPage.getInitialProps = async context => {
  const { data } = await buildClient(context).get('/api/users/currentuser');
  return data;
};

export default LandingPage;
