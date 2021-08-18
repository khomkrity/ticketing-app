import axios from 'axios';

const buildClient = ({ req }) => {
  // check if the method is executed in server or client
  if (typeof window === 'undefined') {
    // server rendering
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // client
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
