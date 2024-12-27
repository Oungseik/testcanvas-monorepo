import { Data } from "effect";

export class DbConnError extends Data.TaggedError("DbConnError")<{}> {}
export class DbError extends Data.TaggedError("DbError")<{}> {}
