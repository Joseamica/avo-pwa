import { IncognitoUser } from '../types/user'

export function getUserLS() {
  return JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }
}
