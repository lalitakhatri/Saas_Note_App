// frontend/src/components/Billing/UpgradeButton.jsx
import { Button, useToast } from '@chakra-ui/react';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';

const UpgradeButton = () => {
    const { auth, refreshUser } = useAuth();
    const toast = useToast();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            toast({ title: 'Could not load payment gateway.', status: 'error' });
            return;
        }

        try {
            const { data: order } = await api.post("/payment/create-order");
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount.toString(),
                currency: order.currency,
                name: "SaaS Notes Pro",
                description: "Upgrade to the Pro Plan",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const { data } = await api.post('/payment/verify', {
                           razorpay_payment_id: response.razorpay_payment_id,
                           razorpay_order_id: response.razorpay_order_id,
                           razorpay_signature: response.razorpay_signature,
                        });
                        
                        toast({ title: data.msg, status: 'success' });
                        refreshUser({ tenantPlan: 'pro' }); // Update context state immediately
                    } catch (error) {
                        toast({ title: 'Payment verification failed.', status: 'error' });
                    }
                },
                prefill: { email: auth.user.email },
                theme: { color: '#6B46C1' }
            };
            
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            toast({ title: 'Error creating payment order.', status: 'error' });
        }
    };

    return <Button colorScheme="yellow" onClick={handlePayment}>Upgrade to Pro</Button>;
};

export default UpgradeButton;