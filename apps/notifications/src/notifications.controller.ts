import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDTO } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('notify_email')
  async notifyEmail(@Payload() data: NotifyEmailDTO) {
    this.notificationsService.notifyEmail(data);
  }

  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: any) {
    this.notificationsService.handleOrderCreatedEvent(data)
  }
}
