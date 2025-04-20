This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Payment Integration with Razorpay

This project includes Razorpay payment gateway integration. To set it up:

1. Create an account at [Razorpay](https://razorpay.com/)
2. Go to the Dashboard > Settings > API Keys
3. Generate API keys (Key ID and Key Secret)
4. Add these keys to your `.env.local` file:



5. Set up webhooks for payment status updates:
   - Go to Dashboard > Settings > Webhooks
   - Add a new webhook with your app's URL: `https://your-domain.com/api/razorpay/webhook`
   - Select events: `payment.authorized`, `payment.captured`, `payment.failed`
   - Generate a webhook secret and add it to your `.env.local` file:
   ```bash
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

6. Restart the development server to apply the changes

For testing, you can use Razorpay's test mode which doesn't process actual payments.

### Test Cards for Razorpay
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: 1234 or 123456 (for testing)

For more details on testing, refer to [Razorpay's documentation](https://razorpay.com/docs/payments/payments/test-card-upi-details/).

## Session Cleanup

To prevent abandoned bookings from staying in the system, we automatically clean up expired session reservations. Our approach is simple and efficient:

1. **Cleanup on User Activity**: The system automatically runs cleanup when:
   - Users browse available session slots
   - Users check their bookings
   - Payment processes run

2. **Manual Cleanup Access**: For administrative purposes, you can manually trigger cleanup:
   - Set a secure `CLEANUP_API_SECRET` in your `.env.local` file
   - Access the cleanup endpoint with proper authorization:

```bash
curl -X GET -H "Authorization: Bearer your-secure-cleanup-secret-key" https://your-domain.com/api/cleanup
```

This approach ensures that cleanup happens frequently during normal system usage, keeping your booking data current without requiring external scheduling tools.
