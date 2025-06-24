<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Order;

class InvoiceMail extends Mailable
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
    public function __construct(Order $order ,array $orderItems)
    {
        $this->order = $order;
                $this->orderItems = $orderItems; // Store order items

    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Invoice',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.invoice',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $pdf = Pdf::loadView('invoices.invoice', ['order' => $this->order ,'orderItems' => $this->orderItems]);

        return [
            \Illuminate\Mail\Mailables\Attachment::fromData(
                fn () => $pdf->output(),
                'invoice-'. now()->format('Y-m-d').$this->order->order_id.'.pdf'
            )->withMime('application/pdf'),
        ];
    }
}
