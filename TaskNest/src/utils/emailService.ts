import emailjs from '@emailjs/browser';

const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

export const sendNotification = async (task: {
  title: string;
  dueDate: string;
  description: string;
}, email: string) => {
  try {
    const templateParams = {
      to_email: email,
      task_title: task.title,
      task_description: task.description,
      due_date: new Date(task.dueDate).toLocaleDateString(),
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
    });

    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};