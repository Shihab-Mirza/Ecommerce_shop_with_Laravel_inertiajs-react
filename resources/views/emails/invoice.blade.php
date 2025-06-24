
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Invoice</title>
    <style>
        /* Reset styles */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', 'Helvetica', sans-serif;
            background-color: #f4f4f4;
            color: #333;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }
        a {
            color: #1a73e8;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        img {
            border: 0;
            display: block;
            max-width: 100%;
            height: auto;
        }

        /* Container */
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin: 20px auto;
            padding: 20px;
        }

        /* Header */
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #1a73e8;
            color: #ffffff;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        /* Content */
        .content {
            padding: 20px;
        }
        .content h2 {
            font-size: 20px;
            margin-bottom: 10px;
            color: #333;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 10px 0;
        }
        .order-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .order-details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .order-details strong {
            color: #1a73e8;
        }

        /* Button */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #1a73e8;
            color: #ffffff;
            text-align: center;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #1557b0;
        }

        /* Footer */
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f4f4f4;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 8px 8px;
        }
        .footer a {
            color: #1a73e8;
        }

        /* Responsive Design */
        @media only screen and (max-width: 600px) {
            .container {
                margin: 10px;
                padding: 10px;
            }
            .header h1 {
                font-size: 20px;
            }
            .content h2 {
                font-size: 18px;
            }
            .button {
                display: block;
                width: 100%;
                box-sizing: border-box;
            }
        }
    </style>
</head>
<body>
    <table role="presentation" class="container">
        <!-- Header -->
        <tr>
            <td class="header">
                <h1>Order Invoice</h1>
            </td>
        </tr>
        <!-- Content -->
        <tr>
            <td class="content">
    <h1>Thank You for Your Purchase!</h1>
    <p>Dear {{ $order->name }},</p>
    <p>Your transaction ID: {{ $order->transaction_id }} was successful.</p>
    <p>Please find your invoice attached.</p>
    <p>Thank you for shopping with us!</p>
                <!-- Order Summary -->
                <h2>Order Summary</h2>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr style="background-color: #f9f9f9; font-weight: 600;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Product</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Quantity</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Unit Price</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Subtotal</td>
                    </tr>
                    @foreach ($orderItems as $item)
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                                {{ $item['product_name'] }}
                            </td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                                {{ $item['quantity'] }}
                            </td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                                Tk{{ number_format($item['unit_price'], 2) }}
                            </td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                                Tk{{ number_format($item['subtotal'], 2) }}
                            </td>
                        </tr>
                    @endforeach

                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right; font-weight: 600;">Total:</td>
                        <td style="padding: 10px; text-align: right; font-weight: 600;">Tk{{ number_format($order->amount, 2) }}</td>
                    </tr>
                </table>

                <p>If you have any questions, feel free to contact our support team</p>
            </td>
        </tr>
        <!-- Footer -->
        <tr>
            <td class="footer">
                <p>© {{ date('Y') }} All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
