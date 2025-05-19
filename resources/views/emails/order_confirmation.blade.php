<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmation</title>
</head>
<body>
    <h1>Order Confirmation</h1>
    <p>Thank you for your order!</p>
    <p><strong>Order Code:</strong> {{ $order->order_id }}</p>
    <p><strong>Order Status:</strong> {{ $order->status }}</p>
    <p>Please keep this information for your records.</p>
</body>
</html>
