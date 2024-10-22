import { useNotifications } from "@toolpad/core";

export const useNotify = () => {
  const notifications = useNotifications();
  const showError = (message: string) => {
    notifications.show(message, {
      severity: "error",
      autoHideDuration: 5000,
    })
  } 
  const showSuccess = (message: string) => notifications.show(message, {
    severity: "success",
    autoHideDuration: 5000,
  })
  return { showError, showSuccess};
}