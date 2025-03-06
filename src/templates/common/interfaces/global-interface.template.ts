export function generateGlobalInterfaceContent(): string {
  return `import { IJwtPayload } from './jwt-payload.interface';

declare module 'express' {
  interface Request {
    user?: IJwtPayload;
  }
}
`;
}
