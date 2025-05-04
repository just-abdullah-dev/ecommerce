import Notification from "@/models/notification";

export const createNotification = async ({
  sentTo,
  title,
  message,
  link = "",
}) => {
  try {
    console.log(sentTo,
      title,
      message,
      link, "from notification creation function");
    
    const notification = await Notification.create({
      sentTo,
      title,
      message,
      link,
    });
    console.log("notification created", notification);
    
    // return {
    //   success: true,
    //   message: "Notification sent to user.",
    //   data: notification,
    // };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to notify user. " + error.message,
    };
  }
};
