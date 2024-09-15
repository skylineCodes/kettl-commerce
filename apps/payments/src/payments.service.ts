import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payment-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private notificationService: ClientProxy
  ) {}

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16'
    }
  )

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd'
    });

    // if (paymentIntent?.status === 'succeeded') {
    //   this.notificationService.emit('notify_email', { email, subject: 'Payment Successful', text: `Your payment of NGN ${amount} has completed successfully!` });
    // } else {
    //   this.notificationService.emit('notify_email', { email, subject: 'Payment Failed', text: `Your payment of NGN ${amount} failed. Please update your card!` });
    // }

    return paymentIntent;
  }
}
