// src/utils/responseHandler.ts

export const successResponse = (data: any, message: string = 'Success', statusCode: number = 200) => {
  return {
    success: true,
    message,
    data,
    statusCode
  };
};

export const errorResponse = (message: string = 'An error occurred', statusCode: number = 500, error: any = null) => {
  return {
    success: false,
    message,
    error,
    statusCode
  };
};