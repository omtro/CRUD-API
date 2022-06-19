import { BaseUser, User } from "./user.interface";
import { Users } from "./users.interface";
import { v4 as uuidv4 } from "uuid";

let users: Users = [];

export const findAllUsers = (): Users => {
  return users;
};

export const findUser = (id: string): User => {
  return users.find((user) => user.id === id);
};

export const createUser = (user: BaseUser) => {
  const newUser: User = {
    id: uuidv4(),
    username: user.username,
    age: user.age,
    hobbies: user.hobbies,
  };
  users.push(newUser);
  return newUser;
};

export const updateUser = async (id: string, user: BaseUser): Promise<User> => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    throw new Error("User not found");
  } else {
    users[userIndex] = {
      id: id,
      username: user.username,
      age: user.age,
      hobbies: user.hobbies,
    };
    return users[userIndex];
  }
};

export const deleteUser = async (id: string): Promise<User> => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  return deletedUser;
};
