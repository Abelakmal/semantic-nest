export function generateJwtInterfaceContent(): string {
  return `export interface IJwtPayload {
  id: number;
  username: string;
  role: string;
}
`;
}
