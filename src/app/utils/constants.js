export const PASSWORD_REGX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const TaskStatus = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};
export const allowedTransitions = {
  [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.DONE],
  [TaskStatus.DONE]: [TaskStatus.PENDING]
};