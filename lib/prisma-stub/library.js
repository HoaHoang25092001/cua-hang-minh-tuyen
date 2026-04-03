// lib/prisma-stub/library.js – Stub for @prisma/client/runtime/library (Prisma 7 compatibility)
// next-admin v8 imports PrismaClientKnownRequestError from this path
// Prisma 7 moved these to @prisma/client directly
const { PrismaClientKnownRequestError, PrismaClientValidationError } = require("@prisma/client");

module.exports = {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
};
