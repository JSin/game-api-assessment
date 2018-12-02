import db from '../util/db';
import { SuccessResponse, UserSaveRequest, UserLoadRequest } from '../constants/interfaces';
import { User } from '../models';
import { ErrorNamesDynamoDB } from '../constants/enums';

export const saveUserData = async (userData: UserSaveRequest): Promise<SuccessResponse> => {
  let userModel = new User();
  userModel.UserId = userData.UserId;
  userModel.Data = userData.Data;

  try {
    userModel = await db.get(Object.assign(new User(), { UserId: userData.UserId }));
  } catch (e) {
    if (e.name !== ErrorNamesDynamoDB.ItemNotFoundException) {
      throw e;
    }
  }

  userModel.Data = Object.assign(userModel.Data, userData.Data);
  db.update(userModel);

  return { Success: true };
};

export const getUserData = async (userReq: UserLoadRequest): Promise<any> => {
  const userModel = new User();
  userModel.UserId = userReq.UserId;
  try {
    const result = await db.get(userModel);
    return result.Data;
  } catch (e) {
    if (e.name === ErrorNamesDynamoDB.ItemNotFoundException) {
      return {};
    }
    throw e;
  }
};
