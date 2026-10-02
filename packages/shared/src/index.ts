export const PRODUCT_NAME = "Proofwork";

export { parseTaskYaml, taskSchema, TaskConfigError, type TaskConfig } from "./task";
export {
  checkDeadline,
  inviteInputSchema,
  MAX_DEADLINE_DAYS,
  MIN_DEADLINE_HOURS,
  type InviteInput,
} from "./invite";
