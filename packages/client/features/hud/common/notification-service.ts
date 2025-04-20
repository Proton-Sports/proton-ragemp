export interface NotificationService {
    drawNotification(image: string, header: string, details: string, message: string): void;
}

class RageMpNotificationService implements NotificationService {
    // Draw a notification with the GTA V notification system
    drawNotification(image: string, header: string, details: string, message: string): void {
        // Begin the text command for notification
        mp.game.ui.setNotificationTextEntry('STRING');

        // Add the message text
        mp.game.ui.addTextComponentSubstringPlayerName(message);

        // Set the notification details with image
        mp.game.ui.setNotificationMessage(
            image.toUpperCase(), // Image (texture dictionary)
            image.toUpperCase(), // Image (texture name)
            false, // Flash
            4, // Icon type
            header, // Sender
            details, // Subject
        );

        // Draw the notification
        mp.game.ui.drawNotification(false, false);
    }
}

export const createRageMpNotificationService = () => {
    return new RageMpNotificationService();
};
