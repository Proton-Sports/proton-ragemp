import { createScript } from '@kernel/script';

interface NotificationDto {
    icon: string;
    title: string;
    secondaryTitle: string;
    body: string;
}

export default createScript({
    name: 'notification',
    fn: ({ messenger, logger, notification }) => {
        // Listen for server notification events
        messenger.on('player:sendNotification', (dto: NotificationDto) => {
            logger.info('Received notification from server');

            // Display the notification using our service
            notification.drawNotification(dto.icon, dto.title, dto.secondaryTitle, dto.body);
        });
    },
});
