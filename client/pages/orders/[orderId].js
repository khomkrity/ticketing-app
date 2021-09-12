import { useEffect, useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  // call it once the component is rendered to calculate expiration
  useEffect(() => {
    const findTimeLeft = () => {
      const milliSecondLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(milliSecondLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51JY4L0HLzMBLHCF1a77TNTQKhlbb2xL3k7h1tqOswYzQeepwmfJynZwc45weTYbS3pqiCYGid7CQdJjCYQD3DXiQ00qc1QoEwS'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
