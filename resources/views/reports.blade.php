<!DOCTYPE html>
<html>
<head>
    <title>Report</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total-row { font-weight: bold; margin-top: 10px; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    <h1>Report</h1>
    <p>From: {{ $from_date }} | To: {{ $to_date }}</p>
    <!-- New Products Added Section -->
    <h3>New Products Added From: {{ $from_date }} | To: {{ $to_date }}</h3>
    <table>
        <thead>
            <tr>
                <th>New products count</th>
                <th>Total Quantity</th>
                <th>Total Price</th>
            </tr>
        </thead>
            <tr >
                <td>{{$productcount}}</td>
              <td>{{$productquantity}}</td>
              <td>{{$productprice}}</td>
            </tr>
    </table>

    <h3>Total Products Added till {{ $CurrentDateTime }}</h3>
    <table>
        <thead>
            <tr>
                <th>Total products count</th>
                <th>Total Quantity</th>
                <th>Total Price</th>
            </tr>
        </thead>
            <tr >
                <td>{{$Currentproductcount}}</td>
              <td>{{$Currentproductquantity}}</td>
              <td>{{$Currentproductprice}}</td>
            </tr>
    </table>



   <h3>New User gained from: {{ $from_date }} | To: {{ $to_date }}</h3>
    <table>
        <thead>
            <tr>
                <th>New user count</th>
            </tr>
        </thead>
            <tr >
                <td>{{$Newusercount}}</td>
            </tr>
    </table>

    <h3>Total Current User {{ $CurrentDateTime }}</h3>
    <table>
        <thead>
            <tr>
                <th>Current user count</th>
            </tr>
        </thead>
            <tr >
                <td>{{$Currentusercount}}</td>
            </tr>
    </table>

  <h3>New Orders from: {{ $from_date }} | To: {{ $to_date }}</h3>

    <!-- Original Orders Table -->
    <table>
        <thead>
            <tr>
                <th>Completed orders</th>
                <th>Total Amount</th>
            </tr>
        </thead>

        <tbody>

            @foreach ($orders as $order)
                <tr>
                    <td>{{ $order_count  }}</td>
                    <td>{{ $total_amount}} Taka</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
