<!DOCTYPE html>
<html>
<head>
    <title>Business Activity Report</title>
    <style>
        /* Global Reset and Typography */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #333;
            background-color: #f9fafb;
            line-height: 1.6;
            padding: 40px;
        }

        /* Container for the report */
        .report-container {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border: 1px solid #e0e0e0;
        }

        /* Header Styling */
        h1 {
            text-align: center;
            font-size: 28px;
            color: #1a3c6d;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }

        .date-range {
            text-align: center;
            font-size: 14px;
            color: #555;
            margin-bottom: 30px;
        }

        /* Section Headers */
        h3 {
            font-size: 18px;
            color: #1a3c6d;
            margin: 20px 0 8px;
            padding-bottom: 8px;
            border-bottom: 2px solid #1a3c6d;
            letter-spacing: 0.5px;
        }

        /* Table Styling */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
        }

        th, td {
            padding: 12px 15px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e0e0e0;
        }

        th {
            background: #1a3c6d;
            background: linear-gradient(180deg, #1a3c6d, #2b5a9b);
            color: #120606;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }

        td {
            color: #333;
        }

        tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        tr:hover {
            background-color: #e6f0fa;
        }

        /* Right-align specific columns */
        .text-right {
            text-align: right;
        }

        /* Total Row Styling */
        .total-row {
            font-weight: bold;
            background: #e6f0fa;
            color: #1a3c6d;
        }

        /* Chart Container */
        .chart-container {
            margin-top: 20px;
            width: 100%;
            text-align: center;
        }

        .chart-container img {
            max-width: 100%;
            height: auto;
        }

        /* Footer for PDF */
        .report-footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
        }

        /* Print-specific styles for PDF */
        @media print {
            body {
                background: none;
                padding: 0;
            }

            .report-container {
                box-shadow: none;
                border: none;
                padding: 20px;
            }

            table {
                page-break-inside: auto;
            }

            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }

            th {
                background: #1a3c6d;
                color: #ffffff;
            }

            .chart-container {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <h1>Business Activity Report</h1>
        <p class="date-range">From: {{ $from_date }} | To: {{ $to_date }}</p>

        <!-- New Products Added Section -->
        <h3>New Products Added ({{ $from_date }} to {{ $to_date }})</h3>
        <table>
            <thead>
                <tr>
                    <th>Serial</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th class="text-right">Price</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($products as $index => $product)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $product->name }}</td>
                        <td>{{ $product->quantity }}</td>
                        <td class="text-right">{{ number_format($product->price, 2) }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4">No new products added.</td>
                    </tr>
                @endforelse
                <tr class="total-row">
                    <td>Total: {{ $productcount }}</td>
                    <td></td>
                    <td>{{ $productquantity }}</td>
                    <td class="text-right">{{ number_format($productprice, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Total Products Section -->
        <h3>Total Products as of {{ $CurrentDateTime }}</h3>
        <table>
            <thead>
                <tr>
                    <th>Total Products Count</th>
                    <th>Total Quantity</th>
                    <th class="text-right">Total Price</th>
                </tr>
            </thead>
            <tbody>
                <tr class="total-row">
                    <td>{{ $Currentproductcount }}</td>
                    <td>{{ $Currentproductquantity }}</td>
                    <td class="text-right">{{ number_format($Currentproductprice, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <!-- New Users Section -->
        <h3>New Users Gained ({{ $from_date }} to {{ $to_date }})</h3>
        <table>
            <thead>
                <tr>
                    <th>New User Count</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $Newusercount }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Total Users Section -->
        <h3>Total Users as of {{ $CurrentDateTime }}</h3>
        <table>
            <thead>
                <tr>
                    <th>Current User Count</th>
                </tr>
            </thead>
            <tbody>
                <tr class="total-row">
                    <td>{{ $Currentusercount }}</td>
                </tr>
            </tbody>
        </table>

        <h3>Completed Orders ({{ $from_date }} to {{ $to_date }})</h3>
<table>
    <thead>
        <tr>
            <th>Order ID</th>
            <th>Order Items</th>
            <th class="text-right">Order Amount</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($orders as $order)
            <tr>
                <td>{{ $order->order_id }}</td>
                <td>
                    @forelse ($order->order_items as $item)
                        <div>{{ $item['quantity'] }} x {{ $item['product_name'] }}</div>
                    @empty
                        <div>No items</div>
                    @endforelse
                </td>
                <td class="text-right">{{ number_format($order->amount, 2) }} Taka</td>
            </tr>
        @endforeach
        <tr class="total-row">
            <td>Total: {{ $order_count }}</td>
            <td></td>
            <td class="text-right">{{ number_format($total_amount, 2) }} Taka</td>
        </tr>
    </tbody>
</table>

        <div class="report-footer">
            Generated on {{ $CurrentDateTime }} by {{ config('app.name') }}
        </div>
    </div>
</body>
</html>
