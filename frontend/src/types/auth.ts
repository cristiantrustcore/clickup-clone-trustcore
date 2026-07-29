export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}
