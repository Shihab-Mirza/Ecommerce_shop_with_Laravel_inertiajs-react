<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        :root {
            --primary: #1e3a8a; /* Deep blue for headers and accents */
            --secondary: #14b8a6; /* Teal for buttons and highlights */
            --background: #f9fafb; /* Light gray background */
            --surface: #ffffff; /* White for main content */
            --text-primary: #111827; /* Dark gray for primary text */
            --text-secondary: #6b7280; /* Lighter gray for secondary text */
            --border: #e5e7eb; /* Subtle border color */
            --shadow: rgba(0, 0, 0, 0.05);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--background);
            color: var(--text-primary);
            line-height: 1.5;
            padding: 24px;
        }

        .invoice-box {
            max-width: 900px;
            margin: 0 auto;
            background-color: var(--surface);
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 12px var(--shadow);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 32px;
        }

        .header .company-details h1 {
            font-size: 28px;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 8px;
        }

        .header .company-details p {
            font-size: 14px;
            color: var(--text-secondary);
            margin: 4px 0;
        }

        .header .invoice-details {
            text-align: right;
            font-size: 14px;
            color: var(--text-secondary);
        }

        .header .invoice-details p {
            margin: 4px 0;
        }

        .header .invoice-details p strong {
            font-weight: 600;
            color: var(--text-primary);
        }

        .customer-info {
            margin-bottom: 32px;
        }

        .customer-info h2 {
            font-size: 20px;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 16px;
        }

        .customer-info .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        .customer-info .grid p {
            font-size: 14px;
            color: var(--text-secondary);
            margin: 6px 0;
        }

        .customer-info .grid p strong {
            font-weight: 600;
            color: var(--text-primary);
        }

        .order-summary h2 {
            font-size: 20px;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 16px;
        }

        .order-summary table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
        }

        .order-summary table thead tr {
            background-color: var(--border);
        }

        .order-summary table th {
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            color: var(--text-primary);
        }

        .order-summary table tbody tr {
            border-bottom: 1px solid var(--border);
        }

        .order-summary table td {
            padding: 12px 16px;
            font-size: 14px;
            color: var(--text-secondary);
        }

        .order-summary table td:last-child,
        .order-summary table th:last-child,
        .order-summary table td:nth-child(2),
        .order-summary table th:nth-child(2),
        .order-summary table td:nth-child(3),
        .order-summary table th:nth-child(3) {
            text-align: right;
        }

        .order-summary table .total-row td {
            font-weight: 600;
            color: var(--text-primary);
            background-color: var(--border);
        }

        .footer-note {
            text-align: center;
            font-size: 14px;
            color: var(--text-secondary);
            margin-top: 32px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
        }

        .print-button {
            text-align: center;
            margin-top: 24px;
        }

        .print-button button {
            background-color: var(--secondary);
            color: var(--surface);
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
        }

        .print-button button:hover {
            background-color: #0d9488;
        }

        @media print {
            body {
                background-color: var(--surface);
                padding: 0;
            }

            .invoice-box {
                box-shadow: none;
                padding: 20px;
                border-radius: 0;
            }

            .print-button {
                display: none;
            }
        }

        @media (max-width: 768px) {
            .header {
                flex-direction: column;
                align-items: flex-start;
                gap: 16px;
            }

            .header .invoice-details {
                text-align: left;
            }

            .customer-info .grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 640px) {
            .invoice-box {
                padding: 20px;
            }

            .header .company-details h1 {
                font-size: 24px;
            }

            .order-summary table th,
            .order-summary table td {
                font-size: 12px;
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <!-- Header -->
        <div class="header">
            <div class="company-details">
                <h1>Invoice</h1>
                <p>Tech Shop</p>
                <p>Dhaka-1230</p>
                <p>Email: contact@techshop.com</p>
            </div>
            <div class="invoice-details">
                <p><strong>Invoice #:</strong> {{ now()->format('Y-m-d') }}-{{ $order->order_id }}</p>
                <p><strong>Date:</strong> {{ now()->format('Y-m-d') }}</p>
            </div>
        </div>

        <!-- Customer Information -->
        <div class="customer-info">
            <h2>Order Information</h2>
            <div class="grid">
                <div>
                    <p><strong>Customer Name:</strong> {{ $order->name ?? 'N/A' }}</p>
                    <p><strong>Shipping Address:</strong> {{ $order->address ?? 'N/A' }}</p>
                </div>
                <div>
                    <p><strong>Order Code:</strong> {{ $order->order_id }}</p>
                    <p><strong>Order Date:</strong> {{ $order->created_at ?? 'N/A' }}</p>
                    <p><strong>Order Type:</strong> {{ $order->order_type ?? 'N/A' }}</p>
                    <p><strong>Transaction ID:</strong> {{ $order->transaction_id ?? 'N/A' }}</p>
                </div>
            </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
            <h2>Order Summary</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($orderItems as $item)
                    <tr>
                        <td>{{ $item['product_name'] }}</td>
                        <td>{{ $item['quantity'] }}</td>
                        <td>Tk{{ number_format($item['unit_price'], 2) }}</td>
                        <td>Tk{{ number_format($item['subtotal'], 2) }}</td>
                    </tr>
                    @endforeach
                    <tr class="total-row">
                        <td colspan="3">Total:</td>
                        <td>Tk{{ number_format($order->amount, 2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Footer Note -->
        <div class="footer-note">
            <p>Thank you for your business! Please contact us at contact@techshop.com for any inquiries.</p>
        </div>


    </div>
</body>
</html>
