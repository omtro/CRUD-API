export interface BaseUser {
  username: string;
  age: number;
  hobbies?: string[];
}

export interface User extends BaseUser {
  id: string;
}
