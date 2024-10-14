

import { Modal, ModalProps } from '@mui/material';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { constants } from '@/constants';
export interface PaymentMoalProps extends ModalProps {
  clientSecret: string;
}

const stripePromise = loadStripe(constants.STRIPE_KEY)
const PaymentModal = (props: PaymentMoalProps) => {
  const {clientSecret, ...modalProps} = props
  return (
    <Modal
    {...modalProps}
    sx={{
      display: "flex",
      p: 1,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{clientSecret}}>
      <EmbeddedCheckout/>
    </EmbeddedCheckoutProvider>
  </Modal>
  );
};


export default PaymentModal;