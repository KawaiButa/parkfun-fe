import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { DialogProps } from "@toolpad/core";

import { constants } from "@/constants";

const stripePromise = loadStripe(constants.STRIPE_KEY);
const PaymentModal = ({ payload, open, onClose }: DialogProps<string>) => {
  return (
    <Dialog open={open} onClose={() => onClose}>
      <DialogContent sx={{width: "500px", "&>paymentContainer": {
        "& App-Background": {
          backgroundColor: "primary.light",
          padding: "20px",
          borderRadius: "10px",
        },
        
      }}} className="hideScrollbar">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret: payload }}>
          <EmbeddedCheckout/>
        </EmbeddedCheckoutProvider>
        <IconButton sx={{
          position: "absolute",
          top: "10px",
          right: "10px"
        }} onClick={() => onClose()}>
        <Close color="primary"/>
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
