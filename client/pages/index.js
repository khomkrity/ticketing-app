import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log('props', currentUser);
  return <h1>Landing Page</h1>;
};

// render component with data during server-side rendering process
LandingPage.getInitialProps = async () => {
  // check the phase that this method is executed
  if (typeof window === 'undefined') {
    // server rendering
    // make requests to laod balancer
    // http://servicename.namespace.svc.cluster.local
    const response = await axios
      .get(
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
        {
          headers: {
            Host: 'ticketing.dev',
          },
        }
      )
      .catch(err => {
        console.log(err);
      });

    return response.data;
  } else {
    // client side
    // make requests to a base url
    const response = await axios.get('/api/users/currentuser').catch(err => {
      console.log(err);
    });

    return response.data;
  }
};

export default LandingPage;
