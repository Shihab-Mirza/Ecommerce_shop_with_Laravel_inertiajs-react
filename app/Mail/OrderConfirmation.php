<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $orderItems; // Add property for order items

    /**
     * Create a new message instance.
     *
     * @param  Order  $order
     * @param  array  $orderItems
     * @return void
     */
    public function __construct(Order $order, array $orderItems)
    {
        $this->order = $order;
        $this->orderItems = $orderItems; // Store order items
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Order Confirmation',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.order_confirmation',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
