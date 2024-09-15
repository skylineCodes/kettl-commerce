import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { NotifyEmailDTO } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { Order } from 'apps/order-service/src/models/order-service.schema';
import { UserDto } from '@app/common';
import { resolve } from 'path';
import { currencySeparator, generateInvoice } from '@app/common/utils/helper.util';
import { ProductServiceService } from 'apps/product-service/src/product-service.service';
import { Invoice } from 'apps/product-service/src/invoice/models/invoice-schema';

const orderTemplatePath = resolve('libs/common/src/template', 'order-template.html');
const invoiceTemplatePath = resolve('libs/common/src/template', 'invoice-template.html');

console.log(`Email template path: ${orderTemplatePath}`);

@Injectable()
export class NotificationsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly productService: ProductServiceService
  ) {}

  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAUTH2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  async handleOrderCreatedEvent(payload: { order: Order | any; user: UserDto, invoice: Invoice }) {
    const { order, user, invoice } = payload;

    const orderItemsHtml = order.orderItems.map((item: { name: string; quantity: string; price: number; currency: string; }) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item?.currency} ${currencySeparator(String(item.price))}</td>
      </tr>
    `).join('');

    const emailHtml = fs.readFileSync(orderTemplatePath, 'utf8')
      .replace('{{ customer_name }}', `${order.user?.firstName} ${order.user?.lastName}`)
      .replace('{{ order_id }}', order?.order_id)
      .replace('{{ currency }}', order?.orderItems[0]?.currency)
      .replace('{{ delivery_fees }}', currencySeparator('500'))
      .replace('{{ currency }}', order?.orderItems[0]?.currency)
      .replace('{{ delivery_discount }}', currencySeparator('0'))
      .replace('{{ currency }}', order?.orderItems[0]?.currency)
      .replace('{{ discount }}', '0')
      .replace('{{ payment_method }}', order?.paymentMethod)
      .replace('{{ order_items }}', orderItemsHtml)
      .replace('{{ currency }}', order?.orderItems[0]?.currency)
      .replace('{{ total_price }}', currencySeparator(order.totalAmount));

      const invoiceItemsHtml = invoice.items.map((item: any) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 10px; font-size: 14px;">${item?.description}</td>
          <td style="border: 1px solid #ddd; padding: 10px; font-size: 14px;">${order?.orderItems[0]?.currency} ${currencySeparator(item?.price)}</td>
          <td style="border: 1px solid #ddd; padding: 10px; font-size: 14px;">${item?.quantity}</td>
          <td style="border: 1px solid #ddd; padding: 10px; font-size: 14px;">${order?.orderItems[0]?.currency} ${currencySeparator(item?.amount)}</td>
        </tr>
      `).join('');
      
    const invoiceHtml = fs.readFileSync(invoiceTemplatePath, 'utf8')
      .replace('{{ invoice_no }}', invoice?.invoiceNo)
      .replace('{{ issued_date }}', String(invoice?.issuedOn))
      .replace('{{ order_id }}', String(invoice?.orderId))
      .replace('{{ customer_name }}', `${order.user?.firstName} ${order.user?.lastName}`)
      .replace('{{ country }}', order.user?.address?.country)
      .replace('{{ customer_email }}', order.user?.email)
      .replace('{{ invoice_items }}', invoiceItemsHtml)
      .replace('{{ currency }}', order?.orderItems[0]?.currency)
      .replace('{{ total }}', currencySeparator(String(invoice?.total)))
      .replace('{{ note }}', String(invoice?.note))

    console.log(invoice);

    // Call the function to generate the PDF
    await generateInvoice(invoiceHtml, resolve('libs/common/src/pdf', `${order?.order_id}-invoice.pdf`))
    .then(() => {
      console.log('PDF generated successfully');
    })
    .catch((err) => {
      console.error('Error generating PDF:', err);
    });

    const attachmentData = {
      filename: `${order?.order_id}-invoice.pdf`,
      path: resolve('libs/common/src/pdf', `${order?.order_id}-invoice.pdf`)
    }

    console.log(attachmentData)

    // Send an email to the customer confirming the order and providing details like the order summary, shipping information, and payment details.
    this.notifyEmail({ email: user?.email, subject: 'Your Order Confirmation', html: emailHtml, attachments: [attachmentData] })

    // Deduct the purchased items from the inventory to ensure accurate stock levels.
    order.orderItems.map(async (item: { _id: string, quantity: string; }) => {
      await this.productService.reduceStockQuantity(item?._id, Number(item?.quantity), user)
    });

    // Update the payment status in the database and possibly trigger payment-related notifications for the finance team.
    // Automatically generate and send an invoice to the customer, which might also be stored in the customer’s account for future reference.
    
    // Mark the order as "Paid" or "Processing" in the database, and possibly change its status in any order management system.
    // Log transaction data for future analysis, including customer behavior, sales trends, and performance metrics.

    // Handle the notification logic here (e.g., send an email, SMS, etc.)
    console.log(`Order ${order.order_id} created for user ${user.email}`);
  }

  async notifyEmail({ email, subject, html, attachments }: NotifyEmailDTO) {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject,
      html,
      attachments,
    });

    setTimeout(async () => {
      try {
        await fs.promises.unlink(attachments[0].path);
        console.log('PDF deleted successfully');
      } catch (err) {
        console.error('Error deleting the PDF:', err);
      }
    }, 3600);
  }
}
