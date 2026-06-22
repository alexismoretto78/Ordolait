
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model CompletedCommand
 * 
 */
export type CompletedCommand = $Result.DefaultSelection<Prisma.$CompletedCommandPayload>
/**
 * Model Reference
 * 
 */
export type Reference = $Result.DefaultSelection<Prisma.$ReferencePayload>
/**
 * Model CompletedReception
 * 
 */
export type CompletedReception = $Result.DefaultSelection<Prisma.$CompletedReceptionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more CompletedCommands
 * const completedCommands = await prisma.completedCommand.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more CompletedCommands
   * const completedCommands = await prisma.completedCommand.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.completedCommand`: Exposes CRUD operations for the **CompletedCommand** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CompletedCommands
    * const completedCommands = await prisma.completedCommand.findMany()
    * ```
    */
  get completedCommand(): Prisma.CompletedCommandDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reference`: Exposes CRUD operations for the **Reference** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more References
    * const references = await prisma.reference.findMany()
    * ```
    */
  get reference(): Prisma.ReferenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.completedReception`: Exposes CRUD operations for the **CompletedReception** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CompletedReceptions
    * const completedReceptions = await prisma.completedReception.findMany()
    * ```
    */
  get completedReception(): Prisma.CompletedReceptionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    CompletedCommand: 'CompletedCommand',
    Reference: 'Reference',
    CompletedReception: 'CompletedReception'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "completedCommand" | "reference" | "completedReception"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CompletedCommand: {
        payload: Prisma.$CompletedCommandPayload<ExtArgs>
        fields: Prisma.CompletedCommandFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompletedCommandFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedCommandPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompletedCommandFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedCommandPayload>
          }
          findFirst: {
            args: Prisma.CompletedCommandFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedCommandPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompletedCommandFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedCommandPayload>
          }
          findMany: {
            args: Prisma.CompletedCommandFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedCommandPayload>[]
          }
          create: {
            args: Prisma.CompletedCommandCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedCommandPayload>
          }
          createMany: {
            args: Prisma.CompletedCommandCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompletedCommandCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedCommandPayload>[]
          }
          delete: {
            args: Prisma.CompletedCommandDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedCommandPayload>
          }
          update: {
            args: Prisma.CompletedCommandUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedCommandPayload>
          }
          deleteMany: {
            args: Prisma.CompletedCommandDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompletedCommandUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CompletedCommandUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedCommandPayload>[]
          }
          upsert: {
            args: Prisma.CompletedCommandUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedCommandPayload>
          }
          aggregate: {
            args: Prisma.CompletedCommandAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompletedCommand>
          }
          groupBy: {
            args: Prisma.CompletedCommandGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompletedCommandGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompletedCommandCountArgs<ExtArgs>
            result: $Utils.Optional<CompletedCommandCountAggregateOutputType> | number
          }
        }
      }
      Reference: {
        payload: Prisma.$ReferencePayload<ExtArgs>
        fields: Prisma.ReferenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReferenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReferenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferencePayload>
          }
          findFirst: {
            args: Prisma.ReferenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReferenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferencePayload>
          }
          findMany: {
            args: Prisma.ReferenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferencePayload>[]
          }
          create: {
            args: Prisma.ReferenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferencePayload>
          }
          createMany: {
            args: Prisma.ReferenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReferenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferencePayload>[]
          }
          delete: {
            args: Prisma.ReferenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferencePayload>
          }
          update: {
            args: Prisma.ReferenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferencePayload>
          }
          deleteMany: {
            args: Prisma.ReferenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReferenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReferenceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferencePayload>[]
          }
          upsert: {
            args: Prisma.ReferenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferencePayload>
          }
          aggregate: {
            args: Prisma.ReferenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReference>
          }
          groupBy: {
            args: Prisma.ReferenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReferenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReferenceCountArgs<ExtArgs>
            result: $Utils.Optional<ReferenceCountAggregateOutputType> | number
          }
        }
      }
      CompletedReception: {
        payload: Prisma.$CompletedReceptionPayload<ExtArgs>
        fields: Prisma.CompletedReceptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompletedReceptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedReceptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompletedReceptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedReceptionPayload>
          }
          findFirst: {
            args: Prisma.CompletedReceptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedReceptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompletedReceptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedReceptionPayload>
          }
          findMany: {
            args: Prisma.CompletedReceptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedReceptionPayload>[]
          }
          create: {
            args: Prisma.CompletedReceptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedReceptionPayload>
          }
          createMany: {
            args: Prisma.CompletedReceptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompletedReceptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedReceptionPayload>[]
          }
          delete: {
            args: Prisma.CompletedReceptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedReceptionPayload>
          }
          update: {
            args: Prisma.CompletedReceptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedReceptionPayload>
          }
          deleteMany: {
            args: Prisma.CompletedReceptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompletedReceptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CompletedReceptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedReceptionPayload>[]
          }
          upsert: {
            args: Prisma.CompletedReceptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompletedReceptionPayload>
          }
          aggregate: {
            args: Prisma.CompletedReceptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompletedReception>
          }
          groupBy: {
            args: Prisma.CompletedReceptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompletedReceptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompletedReceptionCountArgs<ExtArgs>
            result: $Utils.Optional<CompletedReceptionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    completedCommand?: CompletedCommandOmit
    reference?: ReferenceOmit
    completedReception?: CompletedReceptionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CompletedCommandCountOutputType
   */

  export type CompletedCommandCountOutputType = {
    references: number
  }

  export type CompletedCommandCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    references?: boolean | CompletedCommandCountOutputTypeCountReferencesArgs
  }

  // Custom InputTypes
  /**
   * CompletedCommandCountOutputType without action
   */
  export type CompletedCommandCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommandCountOutputType
     */
    select?: CompletedCommandCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompletedCommandCountOutputType without action
   */
  export type CompletedCommandCountOutputTypeCountReferencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReferenceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model CompletedCommand
   */

  export type AggregateCompletedCommand = {
    _count: CompletedCommandCountAggregateOutputType | null
    _avg: CompletedCommandAvgAggregateOutputType | null
    _sum: CompletedCommandSumAggregateOutputType | null
    _min: CompletedCommandMinAggregateOutputType | null
    _max: CompletedCommandMaxAggregateOutputType | null
  }

  export type CompletedCommandAvgAggregateOutputType = {
    whiteMassKg: number | null
    milkReceivedVolume: number | null
    targetValue: number | null
    osmosedVolume: number | null
  }

  export type CompletedCommandSumAggregateOutputType = {
    whiteMassKg: number | null
    milkReceivedVolume: number | null
    targetValue: number | null
    osmosedVolume: number | null
  }

  export type CompletedCommandMinAggregateOutputType = {
    id: string | null
    name: string | null
    status: string | null
    whiteMassKg: number | null
    milkReceivedVolume: number | null
    targetValue: number | null
    osmosedVolume: number | null
    milkType: string | null
    isSkyr: boolean | null
    completedAt: Date | null
  }

  export type CompletedCommandMaxAggregateOutputType = {
    id: string | null
    name: string | null
    status: string | null
    whiteMassKg: number | null
    milkReceivedVolume: number | null
    targetValue: number | null
    osmosedVolume: number | null
    milkType: string | null
    isSkyr: boolean | null
    completedAt: Date | null
  }

  export type CompletedCommandCountAggregateOutputType = {
    id: number
    name: number
    status: number
    whiteMassKg: number
    milkReceivedVolume: number
    targetValue: number
    osmosedVolume: number
    milkType: number
    isSkyr: number
    completedAt: number
    _all: number
  }


  export type CompletedCommandAvgAggregateInputType = {
    whiteMassKg?: true
    milkReceivedVolume?: true
    targetValue?: true
    osmosedVolume?: true
  }

  export type CompletedCommandSumAggregateInputType = {
    whiteMassKg?: true
    milkReceivedVolume?: true
    targetValue?: true
    osmosedVolume?: true
  }

  export type CompletedCommandMinAggregateInputType = {
    id?: true
    name?: true
    status?: true
    whiteMassKg?: true
    milkReceivedVolume?: true
    targetValue?: true
    osmosedVolume?: true
    milkType?: true
    isSkyr?: true
    completedAt?: true
  }

  export type CompletedCommandMaxAggregateInputType = {
    id?: true
    name?: true
    status?: true
    whiteMassKg?: true
    milkReceivedVolume?: true
    targetValue?: true
    osmosedVolume?: true
    milkType?: true
    isSkyr?: true
    completedAt?: true
  }

  export type CompletedCommandCountAggregateInputType = {
    id?: true
    name?: true
    status?: true
    whiteMassKg?: true
    milkReceivedVolume?: true
    targetValue?: true
    osmosedVolume?: true
    milkType?: true
    isSkyr?: true
    completedAt?: true
    _all?: true
  }

  export type CompletedCommandAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompletedCommand to aggregate.
     */
    where?: CompletedCommandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompletedCommands to fetch.
     */
    orderBy?: CompletedCommandOrderByWithRelationInput | CompletedCommandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompletedCommandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompletedCommands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompletedCommands.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CompletedCommands
    **/
    _count?: true | CompletedCommandCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CompletedCommandAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CompletedCommandSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompletedCommandMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompletedCommandMaxAggregateInputType
  }

  export type GetCompletedCommandAggregateType<T extends CompletedCommandAggregateArgs> = {
        [P in keyof T & keyof AggregateCompletedCommand]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompletedCommand[P]>
      : GetScalarType<T[P], AggregateCompletedCommand[P]>
  }




  export type CompletedCommandGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompletedCommandWhereInput
    orderBy?: CompletedCommandOrderByWithAggregationInput | CompletedCommandOrderByWithAggregationInput[]
    by: CompletedCommandScalarFieldEnum[] | CompletedCommandScalarFieldEnum
    having?: CompletedCommandScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompletedCommandCountAggregateInputType | true
    _avg?: CompletedCommandAvgAggregateInputType
    _sum?: CompletedCommandSumAggregateInputType
    _min?: CompletedCommandMinAggregateInputType
    _max?: CompletedCommandMaxAggregateInputType
  }

  export type CompletedCommandGroupByOutputType = {
    id: string
    name: string
    status: string
    whiteMassKg: number
    milkReceivedVolume: number
    targetValue: number
    osmosedVolume: number
    milkType: string
    isSkyr: boolean
    completedAt: Date
    _count: CompletedCommandCountAggregateOutputType | null
    _avg: CompletedCommandAvgAggregateOutputType | null
    _sum: CompletedCommandSumAggregateOutputType | null
    _min: CompletedCommandMinAggregateOutputType | null
    _max: CompletedCommandMaxAggregateOutputType | null
  }

  type GetCompletedCommandGroupByPayload<T extends CompletedCommandGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompletedCommandGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompletedCommandGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompletedCommandGroupByOutputType[P]>
            : GetScalarType<T[P], CompletedCommandGroupByOutputType[P]>
        }
      >
    >


  export type CompletedCommandSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    whiteMassKg?: boolean
    milkReceivedVolume?: boolean
    targetValue?: boolean
    osmosedVolume?: boolean
    milkType?: boolean
    isSkyr?: boolean
    completedAt?: boolean
    references?: boolean | CompletedCommand$referencesArgs<ExtArgs>
    _count?: boolean | CompletedCommandCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["completedCommand"]>

  export type CompletedCommandSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    whiteMassKg?: boolean
    milkReceivedVolume?: boolean
    targetValue?: boolean
    osmosedVolume?: boolean
    milkType?: boolean
    isSkyr?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["completedCommand"]>

  export type CompletedCommandSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    whiteMassKg?: boolean
    milkReceivedVolume?: boolean
    targetValue?: boolean
    osmosedVolume?: boolean
    milkType?: boolean
    isSkyr?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["completedCommand"]>

  export type CompletedCommandSelectScalar = {
    id?: boolean
    name?: boolean
    status?: boolean
    whiteMassKg?: boolean
    milkReceivedVolume?: boolean
    targetValue?: boolean
    osmosedVolume?: boolean
    milkType?: boolean
    isSkyr?: boolean
    completedAt?: boolean
  }

  export type CompletedCommandOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "status" | "whiteMassKg" | "milkReceivedVolume" | "targetValue" | "osmosedVolume" | "milkType" | "isSkyr" | "completedAt", ExtArgs["result"]["completedCommand"]>
  export type CompletedCommandInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    references?: boolean | CompletedCommand$referencesArgs<ExtArgs>
    _count?: boolean | CompletedCommandCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompletedCommandIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CompletedCommandIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CompletedCommandPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CompletedCommand"
    objects: {
      references: Prisma.$ReferencePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      status: string
      whiteMassKg: number
      milkReceivedVolume: number
      targetValue: number
      osmosedVolume: number
      milkType: string
      isSkyr: boolean
      completedAt: Date
    }, ExtArgs["result"]["completedCommand"]>
    composites: {}
  }

  type CompletedCommandGetPayload<S extends boolean | null | undefined | CompletedCommandDefaultArgs> = $Result.GetResult<Prisma.$CompletedCommandPayload, S>

  type CompletedCommandCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompletedCommandFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompletedCommandCountAggregateInputType | true
    }

  export interface CompletedCommandDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CompletedCommand'], meta: { name: 'CompletedCommand' } }
    /**
     * Find zero or one CompletedCommand that matches the filter.
     * @param {CompletedCommandFindUniqueArgs} args - Arguments to find a CompletedCommand
     * @example
     * // Get one CompletedCommand
     * const completedCommand = await prisma.completedCommand.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompletedCommandFindUniqueArgs>(args: SelectSubset<T, CompletedCommandFindUniqueArgs<ExtArgs>>): Prisma__CompletedCommandClient<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CompletedCommand that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompletedCommandFindUniqueOrThrowArgs} args - Arguments to find a CompletedCommand
     * @example
     * // Get one CompletedCommand
     * const completedCommand = await prisma.completedCommand.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompletedCommandFindUniqueOrThrowArgs>(args: SelectSubset<T, CompletedCommandFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompletedCommandClient<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompletedCommand that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedCommandFindFirstArgs} args - Arguments to find a CompletedCommand
     * @example
     * // Get one CompletedCommand
     * const completedCommand = await prisma.completedCommand.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompletedCommandFindFirstArgs>(args?: SelectSubset<T, CompletedCommandFindFirstArgs<ExtArgs>>): Prisma__CompletedCommandClient<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompletedCommand that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedCommandFindFirstOrThrowArgs} args - Arguments to find a CompletedCommand
     * @example
     * // Get one CompletedCommand
     * const completedCommand = await prisma.completedCommand.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompletedCommandFindFirstOrThrowArgs>(args?: SelectSubset<T, CompletedCommandFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompletedCommandClient<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CompletedCommands that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedCommandFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CompletedCommands
     * const completedCommands = await prisma.completedCommand.findMany()
     * 
     * // Get first 10 CompletedCommands
     * const completedCommands = await prisma.completedCommand.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const completedCommandWithIdOnly = await prisma.completedCommand.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompletedCommandFindManyArgs>(args?: SelectSubset<T, CompletedCommandFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CompletedCommand.
     * @param {CompletedCommandCreateArgs} args - Arguments to create a CompletedCommand.
     * @example
     * // Create one CompletedCommand
     * const CompletedCommand = await prisma.completedCommand.create({
     *   data: {
     *     // ... data to create a CompletedCommand
     *   }
     * })
     * 
     */
    create<T extends CompletedCommandCreateArgs>(args: SelectSubset<T, CompletedCommandCreateArgs<ExtArgs>>): Prisma__CompletedCommandClient<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CompletedCommands.
     * @param {CompletedCommandCreateManyArgs} args - Arguments to create many CompletedCommands.
     * @example
     * // Create many CompletedCommands
     * const completedCommand = await prisma.completedCommand.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompletedCommandCreateManyArgs>(args?: SelectSubset<T, CompletedCommandCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CompletedCommands and returns the data saved in the database.
     * @param {CompletedCommandCreateManyAndReturnArgs} args - Arguments to create many CompletedCommands.
     * @example
     * // Create many CompletedCommands
     * const completedCommand = await prisma.completedCommand.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CompletedCommands and only return the `id`
     * const completedCommandWithIdOnly = await prisma.completedCommand.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompletedCommandCreateManyAndReturnArgs>(args?: SelectSubset<T, CompletedCommandCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CompletedCommand.
     * @param {CompletedCommandDeleteArgs} args - Arguments to delete one CompletedCommand.
     * @example
     * // Delete one CompletedCommand
     * const CompletedCommand = await prisma.completedCommand.delete({
     *   where: {
     *     // ... filter to delete one CompletedCommand
     *   }
     * })
     * 
     */
    delete<T extends CompletedCommandDeleteArgs>(args: SelectSubset<T, CompletedCommandDeleteArgs<ExtArgs>>): Prisma__CompletedCommandClient<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CompletedCommand.
     * @param {CompletedCommandUpdateArgs} args - Arguments to update one CompletedCommand.
     * @example
     * // Update one CompletedCommand
     * const completedCommand = await prisma.completedCommand.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompletedCommandUpdateArgs>(args: SelectSubset<T, CompletedCommandUpdateArgs<ExtArgs>>): Prisma__CompletedCommandClient<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CompletedCommands.
     * @param {CompletedCommandDeleteManyArgs} args - Arguments to filter CompletedCommands to delete.
     * @example
     * // Delete a few CompletedCommands
     * const { count } = await prisma.completedCommand.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompletedCommandDeleteManyArgs>(args?: SelectSubset<T, CompletedCommandDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompletedCommands.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedCommandUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CompletedCommands
     * const completedCommand = await prisma.completedCommand.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompletedCommandUpdateManyArgs>(args: SelectSubset<T, CompletedCommandUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompletedCommands and returns the data updated in the database.
     * @param {CompletedCommandUpdateManyAndReturnArgs} args - Arguments to update many CompletedCommands.
     * @example
     * // Update many CompletedCommands
     * const completedCommand = await prisma.completedCommand.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CompletedCommands and only return the `id`
     * const completedCommandWithIdOnly = await prisma.completedCommand.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CompletedCommandUpdateManyAndReturnArgs>(args: SelectSubset<T, CompletedCommandUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CompletedCommand.
     * @param {CompletedCommandUpsertArgs} args - Arguments to update or create a CompletedCommand.
     * @example
     * // Update or create a CompletedCommand
     * const completedCommand = await prisma.completedCommand.upsert({
     *   create: {
     *     // ... data to create a CompletedCommand
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CompletedCommand we want to update
     *   }
     * })
     */
    upsert<T extends CompletedCommandUpsertArgs>(args: SelectSubset<T, CompletedCommandUpsertArgs<ExtArgs>>): Prisma__CompletedCommandClient<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CompletedCommands.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedCommandCountArgs} args - Arguments to filter CompletedCommands to count.
     * @example
     * // Count the number of CompletedCommands
     * const count = await prisma.completedCommand.count({
     *   where: {
     *     // ... the filter for the CompletedCommands we want to count
     *   }
     * })
    **/
    count<T extends CompletedCommandCountArgs>(
      args?: Subset<T, CompletedCommandCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompletedCommandCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CompletedCommand.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedCommandAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompletedCommandAggregateArgs>(args: Subset<T, CompletedCommandAggregateArgs>): Prisma.PrismaPromise<GetCompletedCommandAggregateType<T>>

    /**
     * Group by CompletedCommand.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedCommandGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompletedCommandGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompletedCommandGroupByArgs['orderBy'] }
        : { orderBy?: CompletedCommandGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompletedCommandGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompletedCommandGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CompletedCommand model
   */
  readonly fields: CompletedCommandFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CompletedCommand.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompletedCommandClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    references<T extends CompletedCommand$referencesArgs<ExtArgs> = {}>(args?: Subset<T, CompletedCommand$referencesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CompletedCommand model
   */
  interface CompletedCommandFieldRefs {
    readonly id: FieldRef<"CompletedCommand", 'String'>
    readonly name: FieldRef<"CompletedCommand", 'String'>
    readonly status: FieldRef<"CompletedCommand", 'String'>
    readonly whiteMassKg: FieldRef<"CompletedCommand", 'Float'>
    readonly milkReceivedVolume: FieldRef<"CompletedCommand", 'Float'>
    readonly targetValue: FieldRef<"CompletedCommand", 'Float'>
    readonly osmosedVolume: FieldRef<"CompletedCommand", 'Float'>
    readonly milkType: FieldRef<"CompletedCommand", 'String'>
    readonly isSkyr: FieldRef<"CompletedCommand", 'Boolean'>
    readonly completedAt: FieldRef<"CompletedCommand", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CompletedCommand findUnique
   */
  export type CompletedCommandFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompletedCommandInclude<ExtArgs> | null
    /**
     * Filter, which CompletedCommand to fetch.
     */
    where: CompletedCommandWhereUniqueInput
  }

  /**
   * CompletedCommand findUniqueOrThrow
   */
  export type CompletedCommandFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompletedCommandInclude<ExtArgs> | null
    /**
     * Filter, which CompletedCommand to fetch.
     */
    where: CompletedCommandWhereUniqueInput
  }

  /**
   * CompletedCommand findFirst
   */
  export type CompletedCommandFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompletedCommandInclude<ExtArgs> | null
    /**
     * Filter, which CompletedCommand to fetch.
     */
    where?: CompletedCommandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompletedCommands to fetch.
     */
    orderBy?: CompletedCommandOrderByWithRelationInput | CompletedCommandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompletedCommands.
     */
    cursor?: CompletedCommandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompletedCommands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompletedCommands.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompletedCommands.
     */
    distinct?: CompletedCommandScalarFieldEnum | CompletedCommandScalarFieldEnum[]
  }

  /**
   * CompletedCommand findFirstOrThrow
   */
  export type CompletedCommandFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompletedCommandInclude<ExtArgs> | null
    /**
     * Filter, which CompletedCommand to fetch.
     */
    where?: CompletedCommandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompletedCommands to fetch.
     */
    orderBy?: CompletedCommandOrderByWithRelationInput | CompletedCommandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompletedCommands.
     */
    cursor?: CompletedCommandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompletedCommands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompletedCommands.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompletedCommands.
     */
    distinct?: CompletedCommandScalarFieldEnum | CompletedCommandScalarFieldEnum[]
  }

  /**
   * CompletedCommand findMany
   */
  export type CompletedCommandFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompletedCommandInclude<ExtArgs> | null
    /**
     * Filter, which CompletedCommands to fetch.
     */
    where?: CompletedCommandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompletedCommands to fetch.
     */
    orderBy?: CompletedCommandOrderByWithRelationInput | CompletedCommandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CompletedCommands.
     */
    cursor?: CompletedCommandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompletedCommands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompletedCommands.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompletedCommands.
     */
    distinct?: CompletedCommandScalarFieldEnum | CompletedCommandScalarFieldEnum[]
  }

  /**
   * CompletedCommand create
   */
  export type CompletedCommandCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompletedCommandInclude<ExtArgs> | null
    /**
     * The data needed to create a CompletedCommand.
     */
    data: XOR<CompletedCommandCreateInput, CompletedCommandUncheckedCreateInput>
  }

  /**
   * CompletedCommand createMany
   */
  export type CompletedCommandCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CompletedCommands.
     */
    data: CompletedCommandCreateManyInput | CompletedCommandCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompletedCommand createManyAndReturn
   */
  export type CompletedCommandCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * The data used to create many CompletedCommands.
     */
    data: CompletedCommandCreateManyInput | CompletedCommandCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompletedCommand update
   */
  export type CompletedCommandUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompletedCommandInclude<ExtArgs> | null
    /**
     * The data needed to update a CompletedCommand.
     */
    data: XOR<CompletedCommandUpdateInput, CompletedCommandUncheckedUpdateInput>
    /**
     * Choose, which CompletedCommand to update.
     */
    where: CompletedCommandWhereUniqueInput
  }

  /**
   * CompletedCommand updateMany
   */
  export type CompletedCommandUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CompletedCommands.
     */
    data: XOR<CompletedCommandUpdateManyMutationInput, CompletedCommandUncheckedUpdateManyInput>
    /**
     * Filter which CompletedCommands to update
     */
    where?: CompletedCommandWhereInput
    /**
     * Limit how many CompletedCommands to update.
     */
    limit?: number
  }

  /**
   * CompletedCommand updateManyAndReturn
   */
  export type CompletedCommandUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * The data used to update CompletedCommands.
     */
    data: XOR<CompletedCommandUpdateManyMutationInput, CompletedCommandUncheckedUpdateManyInput>
    /**
     * Filter which CompletedCommands to update
     */
    where?: CompletedCommandWhereInput
    /**
     * Limit how many CompletedCommands to update.
     */
    limit?: number
  }

  /**
   * CompletedCommand upsert
   */
  export type CompletedCommandUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompletedCommandInclude<ExtArgs> | null
    /**
     * The filter to search for the CompletedCommand to update in case it exists.
     */
    where: CompletedCommandWhereUniqueInput
    /**
     * In case the CompletedCommand found by the `where` argument doesn't exist, create a new CompletedCommand with this data.
     */
    create: XOR<CompletedCommandCreateInput, CompletedCommandUncheckedCreateInput>
    /**
     * In case the CompletedCommand was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompletedCommandUpdateInput, CompletedCommandUncheckedUpdateInput>
  }

  /**
   * CompletedCommand delete
   */
  export type CompletedCommandDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompletedCommandInclude<ExtArgs> | null
    /**
     * Filter which CompletedCommand to delete.
     */
    where: CompletedCommandWhereUniqueInput
  }

  /**
   * CompletedCommand deleteMany
   */
  export type CompletedCommandDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompletedCommands to delete
     */
    where?: CompletedCommandWhereInput
    /**
     * Limit how many CompletedCommands to delete.
     */
    limit?: number
  }

  /**
   * CompletedCommand.references
   */
  export type CompletedCommand$referencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceInclude<ExtArgs> | null
    where?: ReferenceWhereInput
    orderBy?: ReferenceOrderByWithRelationInput | ReferenceOrderByWithRelationInput[]
    cursor?: ReferenceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReferenceScalarFieldEnum | ReferenceScalarFieldEnum[]
  }

  /**
   * CompletedCommand without action
   */
  export type CompletedCommandDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedCommand
     */
    select?: CompletedCommandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedCommand
     */
    omit?: CompletedCommandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompletedCommandInclude<ExtArgs> | null
  }


  /**
   * Model Reference
   */

  export type AggregateReference = {
    _count: ReferenceCountAggregateOutputType | null
    _avg: ReferenceAvgAggregateOutputType | null
    _sum: ReferenceSumAggregateOutputType | null
    _min: ReferenceMinAggregateOutputType | null
    _max: ReferenceMaxAggregateOutputType | null
  }

  export type ReferenceAvgAggregateOutputType = {
    potsQty: number | null
    gramPerPot: number | null
  }

  export type ReferenceSumAggregateOutputType = {
    potsQty: number | null
    gramPerPot: number | null
  }

  export type ReferenceMinAggregateOutputType = {
    id: string | null
    commandId: string | null
    name: string | null
    potsQty: number | null
    gramPerPot: number | null
  }

  export type ReferenceMaxAggregateOutputType = {
    id: string | null
    commandId: string | null
    name: string | null
    potsQty: number | null
    gramPerPot: number | null
  }

  export type ReferenceCountAggregateOutputType = {
    id: number
    commandId: number
    name: number
    potsQty: number
    gramPerPot: number
    _all: number
  }


  export type ReferenceAvgAggregateInputType = {
    potsQty?: true
    gramPerPot?: true
  }

  export type ReferenceSumAggregateInputType = {
    potsQty?: true
    gramPerPot?: true
  }

  export type ReferenceMinAggregateInputType = {
    id?: true
    commandId?: true
    name?: true
    potsQty?: true
    gramPerPot?: true
  }

  export type ReferenceMaxAggregateInputType = {
    id?: true
    commandId?: true
    name?: true
    potsQty?: true
    gramPerPot?: true
  }

  export type ReferenceCountAggregateInputType = {
    id?: true
    commandId?: true
    name?: true
    potsQty?: true
    gramPerPot?: true
    _all?: true
  }

  export type ReferenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reference to aggregate.
     */
    where?: ReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of References to fetch.
     */
    orderBy?: ReferenceOrderByWithRelationInput | ReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` References from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` References.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned References
    **/
    _count?: true | ReferenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReferenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReferenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReferenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReferenceMaxAggregateInputType
  }

  export type GetReferenceAggregateType<T extends ReferenceAggregateArgs> = {
        [P in keyof T & keyof AggregateReference]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReference[P]>
      : GetScalarType<T[P], AggregateReference[P]>
  }




  export type ReferenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReferenceWhereInput
    orderBy?: ReferenceOrderByWithAggregationInput | ReferenceOrderByWithAggregationInput[]
    by: ReferenceScalarFieldEnum[] | ReferenceScalarFieldEnum
    having?: ReferenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReferenceCountAggregateInputType | true
    _avg?: ReferenceAvgAggregateInputType
    _sum?: ReferenceSumAggregateInputType
    _min?: ReferenceMinAggregateInputType
    _max?: ReferenceMaxAggregateInputType
  }

  export type ReferenceGroupByOutputType = {
    id: string
    commandId: string
    name: string
    potsQty: number
    gramPerPot: number
    _count: ReferenceCountAggregateOutputType | null
    _avg: ReferenceAvgAggregateOutputType | null
    _sum: ReferenceSumAggregateOutputType | null
    _min: ReferenceMinAggregateOutputType | null
    _max: ReferenceMaxAggregateOutputType | null
  }

  type GetReferenceGroupByPayload<T extends ReferenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReferenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReferenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReferenceGroupByOutputType[P]>
            : GetScalarType<T[P], ReferenceGroupByOutputType[P]>
        }
      >
    >


  export type ReferenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commandId?: boolean
    name?: boolean
    potsQty?: boolean
    gramPerPot?: boolean
    command?: boolean | CompletedCommandDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reference"]>

  export type ReferenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commandId?: boolean
    name?: boolean
    potsQty?: boolean
    gramPerPot?: boolean
    command?: boolean | CompletedCommandDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reference"]>

  export type ReferenceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commandId?: boolean
    name?: boolean
    potsQty?: boolean
    gramPerPot?: boolean
    command?: boolean | CompletedCommandDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reference"]>

  export type ReferenceSelectScalar = {
    id?: boolean
    commandId?: boolean
    name?: boolean
    potsQty?: boolean
    gramPerPot?: boolean
  }

  export type ReferenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "commandId" | "name" | "potsQty" | "gramPerPot", ExtArgs["result"]["reference"]>
  export type ReferenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    command?: boolean | CompletedCommandDefaultArgs<ExtArgs>
  }
  export type ReferenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    command?: boolean | CompletedCommandDefaultArgs<ExtArgs>
  }
  export type ReferenceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    command?: boolean | CompletedCommandDefaultArgs<ExtArgs>
  }

  export type $ReferencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reference"
    objects: {
      command: Prisma.$CompletedCommandPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      commandId: string
      name: string
      potsQty: number
      gramPerPot: number
    }, ExtArgs["result"]["reference"]>
    composites: {}
  }

  type ReferenceGetPayload<S extends boolean | null | undefined | ReferenceDefaultArgs> = $Result.GetResult<Prisma.$ReferencePayload, S>

  type ReferenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReferenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReferenceCountAggregateInputType | true
    }

  export interface ReferenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reference'], meta: { name: 'Reference' } }
    /**
     * Find zero or one Reference that matches the filter.
     * @param {ReferenceFindUniqueArgs} args - Arguments to find a Reference
     * @example
     * // Get one Reference
     * const reference = await prisma.reference.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReferenceFindUniqueArgs>(args: SelectSubset<T, ReferenceFindUniqueArgs<ExtArgs>>): Prisma__ReferenceClient<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reference that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReferenceFindUniqueOrThrowArgs} args - Arguments to find a Reference
     * @example
     * // Get one Reference
     * const reference = await prisma.reference.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReferenceFindUniqueOrThrowArgs>(args: SelectSubset<T, ReferenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReferenceClient<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reference that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferenceFindFirstArgs} args - Arguments to find a Reference
     * @example
     * // Get one Reference
     * const reference = await prisma.reference.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReferenceFindFirstArgs>(args?: SelectSubset<T, ReferenceFindFirstArgs<ExtArgs>>): Prisma__ReferenceClient<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reference that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferenceFindFirstOrThrowArgs} args - Arguments to find a Reference
     * @example
     * // Get one Reference
     * const reference = await prisma.reference.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReferenceFindFirstOrThrowArgs>(args?: SelectSubset<T, ReferenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReferenceClient<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more References that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all References
     * const references = await prisma.reference.findMany()
     * 
     * // Get first 10 References
     * const references = await prisma.reference.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const referenceWithIdOnly = await prisma.reference.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReferenceFindManyArgs>(args?: SelectSubset<T, ReferenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reference.
     * @param {ReferenceCreateArgs} args - Arguments to create a Reference.
     * @example
     * // Create one Reference
     * const Reference = await prisma.reference.create({
     *   data: {
     *     // ... data to create a Reference
     *   }
     * })
     * 
     */
    create<T extends ReferenceCreateArgs>(args: SelectSubset<T, ReferenceCreateArgs<ExtArgs>>): Prisma__ReferenceClient<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many References.
     * @param {ReferenceCreateManyArgs} args - Arguments to create many References.
     * @example
     * // Create many References
     * const reference = await prisma.reference.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReferenceCreateManyArgs>(args?: SelectSubset<T, ReferenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many References and returns the data saved in the database.
     * @param {ReferenceCreateManyAndReturnArgs} args - Arguments to create many References.
     * @example
     * // Create many References
     * const reference = await prisma.reference.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many References and only return the `id`
     * const referenceWithIdOnly = await prisma.reference.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReferenceCreateManyAndReturnArgs>(args?: SelectSubset<T, ReferenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reference.
     * @param {ReferenceDeleteArgs} args - Arguments to delete one Reference.
     * @example
     * // Delete one Reference
     * const Reference = await prisma.reference.delete({
     *   where: {
     *     // ... filter to delete one Reference
     *   }
     * })
     * 
     */
    delete<T extends ReferenceDeleteArgs>(args: SelectSubset<T, ReferenceDeleteArgs<ExtArgs>>): Prisma__ReferenceClient<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reference.
     * @param {ReferenceUpdateArgs} args - Arguments to update one Reference.
     * @example
     * // Update one Reference
     * const reference = await prisma.reference.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReferenceUpdateArgs>(args: SelectSubset<T, ReferenceUpdateArgs<ExtArgs>>): Prisma__ReferenceClient<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more References.
     * @param {ReferenceDeleteManyArgs} args - Arguments to filter References to delete.
     * @example
     * // Delete a few References
     * const { count } = await prisma.reference.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReferenceDeleteManyArgs>(args?: SelectSubset<T, ReferenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more References.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many References
     * const reference = await prisma.reference.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReferenceUpdateManyArgs>(args: SelectSubset<T, ReferenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more References and returns the data updated in the database.
     * @param {ReferenceUpdateManyAndReturnArgs} args - Arguments to update many References.
     * @example
     * // Update many References
     * const reference = await prisma.reference.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more References and only return the `id`
     * const referenceWithIdOnly = await prisma.reference.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReferenceUpdateManyAndReturnArgs>(args: SelectSubset<T, ReferenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reference.
     * @param {ReferenceUpsertArgs} args - Arguments to update or create a Reference.
     * @example
     * // Update or create a Reference
     * const reference = await prisma.reference.upsert({
     *   create: {
     *     // ... data to create a Reference
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reference we want to update
     *   }
     * })
     */
    upsert<T extends ReferenceUpsertArgs>(args: SelectSubset<T, ReferenceUpsertArgs<ExtArgs>>): Prisma__ReferenceClient<$Result.GetResult<Prisma.$ReferencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of References.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferenceCountArgs} args - Arguments to filter References to count.
     * @example
     * // Count the number of References
     * const count = await prisma.reference.count({
     *   where: {
     *     // ... the filter for the References we want to count
     *   }
     * })
    **/
    count<T extends ReferenceCountArgs>(
      args?: Subset<T, ReferenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReferenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReferenceAggregateArgs>(args: Subset<T, ReferenceAggregateArgs>): Prisma.PrismaPromise<GetReferenceAggregateType<T>>

    /**
     * Group by Reference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReferenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReferenceGroupByArgs['orderBy'] }
        : { orderBy?: ReferenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReferenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReferenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reference model
   */
  readonly fields: ReferenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reference.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReferenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    command<T extends CompletedCommandDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompletedCommandDefaultArgs<ExtArgs>>): Prisma__CompletedCommandClient<$Result.GetResult<Prisma.$CompletedCommandPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reference model
   */
  interface ReferenceFieldRefs {
    readonly id: FieldRef<"Reference", 'String'>
    readonly commandId: FieldRef<"Reference", 'String'>
    readonly name: FieldRef<"Reference", 'String'>
    readonly potsQty: FieldRef<"Reference", 'Int'>
    readonly gramPerPot: FieldRef<"Reference", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * Reference findUnique
   */
  export type ReferenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceInclude<ExtArgs> | null
    /**
     * Filter, which Reference to fetch.
     */
    where: ReferenceWhereUniqueInput
  }

  /**
   * Reference findUniqueOrThrow
   */
  export type ReferenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceInclude<ExtArgs> | null
    /**
     * Filter, which Reference to fetch.
     */
    where: ReferenceWhereUniqueInput
  }

  /**
   * Reference findFirst
   */
  export type ReferenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceInclude<ExtArgs> | null
    /**
     * Filter, which Reference to fetch.
     */
    where?: ReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of References to fetch.
     */
    orderBy?: ReferenceOrderByWithRelationInput | ReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for References.
     */
    cursor?: ReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` References from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` References.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of References.
     */
    distinct?: ReferenceScalarFieldEnum | ReferenceScalarFieldEnum[]
  }

  /**
   * Reference findFirstOrThrow
   */
  export type ReferenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceInclude<ExtArgs> | null
    /**
     * Filter, which Reference to fetch.
     */
    where?: ReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of References to fetch.
     */
    orderBy?: ReferenceOrderByWithRelationInput | ReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for References.
     */
    cursor?: ReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` References from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` References.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of References.
     */
    distinct?: ReferenceScalarFieldEnum | ReferenceScalarFieldEnum[]
  }

  /**
   * Reference findMany
   */
  export type ReferenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceInclude<ExtArgs> | null
    /**
     * Filter, which References to fetch.
     */
    where?: ReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of References to fetch.
     */
    orderBy?: ReferenceOrderByWithRelationInput | ReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing References.
     */
    cursor?: ReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` References from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` References.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of References.
     */
    distinct?: ReferenceScalarFieldEnum | ReferenceScalarFieldEnum[]
  }

  /**
   * Reference create
   */
  export type ReferenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceInclude<ExtArgs> | null
    /**
     * The data needed to create a Reference.
     */
    data: XOR<ReferenceCreateInput, ReferenceUncheckedCreateInput>
  }

  /**
   * Reference createMany
   */
  export type ReferenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many References.
     */
    data: ReferenceCreateManyInput | ReferenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reference createManyAndReturn
   */
  export type ReferenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * The data used to create many References.
     */
    data: ReferenceCreateManyInput | ReferenceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reference update
   */
  export type ReferenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceInclude<ExtArgs> | null
    /**
     * The data needed to update a Reference.
     */
    data: XOR<ReferenceUpdateInput, ReferenceUncheckedUpdateInput>
    /**
     * Choose, which Reference to update.
     */
    where: ReferenceWhereUniqueInput
  }

  /**
   * Reference updateMany
   */
  export type ReferenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update References.
     */
    data: XOR<ReferenceUpdateManyMutationInput, ReferenceUncheckedUpdateManyInput>
    /**
     * Filter which References to update
     */
    where?: ReferenceWhereInput
    /**
     * Limit how many References to update.
     */
    limit?: number
  }

  /**
   * Reference updateManyAndReturn
   */
  export type ReferenceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * The data used to update References.
     */
    data: XOR<ReferenceUpdateManyMutationInput, ReferenceUncheckedUpdateManyInput>
    /**
     * Filter which References to update
     */
    where?: ReferenceWhereInput
    /**
     * Limit how many References to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reference upsert
   */
  export type ReferenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceInclude<ExtArgs> | null
    /**
     * The filter to search for the Reference to update in case it exists.
     */
    where: ReferenceWhereUniqueInput
    /**
     * In case the Reference found by the `where` argument doesn't exist, create a new Reference with this data.
     */
    create: XOR<ReferenceCreateInput, ReferenceUncheckedCreateInput>
    /**
     * In case the Reference was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReferenceUpdateInput, ReferenceUncheckedUpdateInput>
  }

  /**
   * Reference delete
   */
  export type ReferenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceInclude<ExtArgs> | null
    /**
     * Filter which Reference to delete.
     */
    where: ReferenceWhereUniqueInput
  }

  /**
   * Reference deleteMany
   */
  export type ReferenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which References to delete
     */
    where?: ReferenceWhereInput
    /**
     * Limit how many References to delete.
     */
    limit?: number
  }

  /**
   * Reference without action
   */
  export type ReferenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reference
     */
    select?: ReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reference
     */
    omit?: ReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferenceInclude<ExtArgs> | null
  }


  /**
   * Model CompletedReception
   */

  export type AggregateCompletedReception = {
    _count: CompletedReceptionCountAggregateOutputType | null
    _avg: CompletedReceptionAvgAggregateOutputType | null
    _sum: CompletedReceptionSumAggregateOutputType | null
    _min: CompletedReceptionMinAggregateOutputType | null
    _max: CompletedReceptionMaxAggregateOutputType | null
  }

  export type CompletedReceptionAvgAggregateOutputType = {
    volume: number | null
    protein: number | null
    fat: number | null
  }

  export type CompletedReceptionSumAggregateOutputType = {
    volume: number | null
    protein: number | null
    fat: number | null
  }

  export type CompletedReceptionMinAggregateOutputType = {
    id: string | null
    lotNumber: string | null
    volume: number | null
    protein: number | null
    fat: number | null
    milkType: string | null
    deliveryDate: Date | null
    completedAt: Date | null
  }

  export type CompletedReceptionMaxAggregateOutputType = {
    id: string | null
    lotNumber: string | null
    volume: number | null
    protein: number | null
    fat: number | null
    milkType: string | null
    deliveryDate: Date | null
    completedAt: Date | null
  }

  export type CompletedReceptionCountAggregateOutputType = {
    id: number
    lotNumber: number
    volume: number
    protein: number
    fat: number
    milkType: number
    deliveryDate: number
    completedAt: number
    _all: number
  }


  export type CompletedReceptionAvgAggregateInputType = {
    volume?: true
    protein?: true
    fat?: true
  }

  export type CompletedReceptionSumAggregateInputType = {
    volume?: true
    protein?: true
    fat?: true
  }

  export type CompletedReceptionMinAggregateInputType = {
    id?: true
    lotNumber?: true
    volume?: true
    protein?: true
    fat?: true
    milkType?: true
    deliveryDate?: true
    completedAt?: true
  }

  export type CompletedReceptionMaxAggregateInputType = {
    id?: true
    lotNumber?: true
    volume?: true
    protein?: true
    fat?: true
    milkType?: true
    deliveryDate?: true
    completedAt?: true
  }

  export type CompletedReceptionCountAggregateInputType = {
    id?: true
    lotNumber?: true
    volume?: true
    protein?: true
    fat?: true
    milkType?: true
    deliveryDate?: true
    completedAt?: true
    _all?: true
  }

  export type CompletedReceptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompletedReception to aggregate.
     */
    where?: CompletedReceptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompletedReceptions to fetch.
     */
    orderBy?: CompletedReceptionOrderByWithRelationInput | CompletedReceptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompletedReceptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompletedReceptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompletedReceptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CompletedReceptions
    **/
    _count?: true | CompletedReceptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CompletedReceptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CompletedReceptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompletedReceptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompletedReceptionMaxAggregateInputType
  }

  export type GetCompletedReceptionAggregateType<T extends CompletedReceptionAggregateArgs> = {
        [P in keyof T & keyof AggregateCompletedReception]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompletedReception[P]>
      : GetScalarType<T[P], AggregateCompletedReception[P]>
  }




  export type CompletedReceptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompletedReceptionWhereInput
    orderBy?: CompletedReceptionOrderByWithAggregationInput | CompletedReceptionOrderByWithAggregationInput[]
    by: CompletedReceptionScalarFieldEnum[] | CompletedReceptionScalarFieldEnum
    having?: CompletedReceptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompletedReceptionCountAggregateInputType | true
    _avg?: CompletedReceptionAvgAggregateInputType
    _sum?: CompletedReceptionSumAggregateInputType
    _min?: CompletedReceptionMinAggregateInputType
    _max?: CompletedReceptionMaxAggregateInputType
  }

  export type CompletedReceptionGroupByOutputType = {
    id: string
    lotNumber: string
    volume: number
    protein: number
    fat: number
    milkType: string
    deliveryDate: Date
    completedAt: Date
    _count: CompletedReceptionCountAggregateOutputType | null
    _avg: CompletedReceptionAvgAggregateOutputType | null
    _sum: CompletedReceptionSumAggregateOutputType | null
    _min: CompletedReceptionMinAggregateOutputType | null
    _max: CompletedReceptionMaxAggregateOutputType | null
  }

  type GetCompletedReceptionGroupByPayload<T extends CompletedReceptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompletedReceptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompletedReceptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompletedReceptionGroupByOutputType[P]>
            : GetScalarType<T[P], CompletedReceptionGroupByOutputType[P]>
        }
      >
    >


  export type CompletedReceptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lotNumber?: boolean
    volume?: boolean
    protein?: boolean
    fat?: boolean
    milkType?: boolean
    deliveryDate?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["completedReception"]>

  export type CompletedReceptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lotNumber?: boolean
    volume?: boolean
    protein?: boolean
    fat?: boolean
    milkType?: boolean
    deliveryDate?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["completedReception"]>

  export type CompletedReceptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lotNumber?: boolean
    volume?: boolean
    protein?: boolean
    fat?: boolean
    milkType?: boolean
    deliveryDate?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["completedReception"]>

  export type CompletedReceptionSelectScalar = {
    id?: boolean
    lotNumber?: boolean
    volume?: boolean
    protein?: boolean
    fat?: boolean
    milkType?: boolean
    deliveryDate?: boolean
    completedAt?: boolean
  }

  export type CompletedReceptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lotNumber" | "volume" | "protein" | "fat" | "milkType" | "deliveryDate" | "completedAt", ExtArgs["result"]["completedReception"]>

  export type $CompletedReceptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CompletedReception"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      lotNumber: string
      volume: number
      protein: number
      fat: number
      milkType: string
      deliveryDate: Date
      completedAt: Date
    }, ExtArgs["result"]["completedReception"]>
    composites: {}
  }

  type CompletedReceptionGetPayload<S extends boolean | null | undefined | CompletedReceptionDefaultArgs> = $Result.GetResult<Prisma.$CompletedReceptionPayload, S>

  type CompletedReceptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompletedReceptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompletedReceptionCountAggregateInputType | true
    }

  export interface CompletedReceptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CompletedReception'], meta: { name: 'CompletedReception' } }
    /**
     * Find zero or one CompletedReception that matches the filter.
     * @param {CompletedReceptionFindUniqueArgs} args - Arguments to find a CompletedReception
     * @example
     * // Get one CompletedReception
     * const completedReception = await prisma.completedReception.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompletedReceptionFindUniqueArgs>(args: SelectSubset<T, CompletedReceptionFindUniqueArgs<ExtArgs>>): Prisma__CompletedReceptionClient<$Result.GetResult<Prisma.$CompletedReceptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CompletedReception that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompletedReceptionFindUniqueOrThrowArgs} args - Arguments to find a CompletedReception
     * @example
     * // Get one CompletedReception
     * const completedReception = await prisma.completedReception.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompletedReceptionFindUniqueOrThrowArgs>(args: SelectSubset<T, CompletedReceptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompletedReceptionClient<$Result.GetResult<Prisma.$CompletedReceptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompletedReception that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedReceptionFindFirstArgs} args - Arguments to find a CompletedReception
     * @example
     * // Get one CompletedReception
     * const completedReception = await prisma.completedReception.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompletedReceptionFindFirstArgs>(args?: SelectSubset<T, CompletedReceptionFindFirstArgs<ExtArgs>>): Prisma__CompletedReceptionClient<$Result.GetResult<Prisma.$CompletedReceptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompletedReception that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedReceptionFindFirstOrThrowArgs} args - Arguments to find a CompletedReception
     * @example
     * // Get one CompletedReception
     * const completedReception = await prisma.completedReception.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompletedReceptionFindFirstOrThrowArgs>(args?: SelectSubset<T, CompletedReceptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompletedReceptionClient<$Result.GetResult<Prisma.$CompletedReceptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CompletedReceptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedReceptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CompletedReceptions
     * const completedReceptions = await prisma.completedReception.findMany()
     * 
     * // Get first 10 CompletedReceptions
     * const completedReceptions = await prisma.completedReception.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const completedReceptionWithIdOnly = await prisma.completedReception.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompletedReceptionFindManyArgs>(args?: SelectSubset<T, CompletedReceptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompletedReceptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CompletedReception.
     * @param {CompletedReceptionCreateArgs} args - Arguments to create a CompletedReception.
     * @example
     * // Create one CompletedReception
     * const CompletedReception = await prisma.completedReception.create({
     *   data: {
     *     // ... data to create a CompletedReception
     *   }
     * })
     * 
     */
    create<T extends CompletedReceptionCreateArgs>(args: SelectSubset<T, CompletedReceptionCreateArgs<ExtArgs>>): Prisma__CompletedReceptionClient<$Result.GetResult<Prisma.$CompletedReceptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CompletedReceptions.
     * @param {CompletedReceptionCreateManyArgs} args - Arguments to create many CompletedReceptions.
     * @example
     * // Create many CompletedReceptions
     * const completedReception = await prisma.completedReception.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompletedReceptionCreateManyArgs>(args?: SelectSubset<T, CompletedReceptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CompletedReceptions and returns the data saved in the database.
     * @param {CompletedReceptionCreateManyAndReturnArgs} args - Arguments to create many CompletedReceptions.
     * @example
     * // Create many CompletedReceptions
     * const completedReception = await prisma.completedReception.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CompletedReceptions and only return the `id`
     * const completedReceptionWithIdOnly = await prisma.completedReception.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompletedReceptionCreateManyAndReturnArgs>(args?: SelectSubset<T, CompletedReceptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompletedReceptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CompletedReception.
     * @param {CompletedReceptionDeleteArgs} args - Arguments to delete one CompletedReception.
     * @example
     * // Delete one CompletedReception
     * const CompletedReception = await prisma.completedReception.delete({
     *   where: {
     *     // ... filter to delete one CompletedReception
     *   }
     * })
     * 
     */
    delete<T extends CompletedReceptionDeleteArgs>(args: SelectSubset<T, CompletedReceptionDeleteArgs<ExtArgs>>): Prisma__CompletedReceptionClient<$Result.GetResult<Prisma.$CompletedReceptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CompletedReception.
     * @param {CompletedReceptionUpdateArgs} args - Arguments to update one CompletedReception.
     * @example
     * // Update one CompletedReception
     * const completedReception = await prisma.completedReception.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompletedReceptionUpdateArgs>(args: SelectSubset<T, CompletedReceptionUpdateArgs<ExtArgs>>): Prisma__CompletedReceptionClient<$Result.GetResult<Prisma.$CompletedReceptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CompletedReceptions.
     * @param {CompletedReceptionDeleteManyArgs} args - Arguments to filter CompletedReceptions to delete.
     * @example
     * // Delete a few CompletedReceptions
     * const { count } = await prisma.completedReception.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompletedReceptionDeleteManyArgs>(args?: SelectSubset<T, CompletedReceptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompletedReceptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedReceptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CompletedReceptions
     * const completedReception = await prisma.completedReception.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompletedReceptionUpdateManyArgs>(args: SelectSubset<T, CompletedReceptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompletedReceptions and returns the data updated in the database.
     * @param {CompletedReceptionUpdateManyAndReturnArgs} args - Arguments to update many CompletedReceptions.
     * @example
     * // Update many CompletedReceptions
     * const completedReception = await prisma.completedReception.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CompletedReceptions and only return the `id`
     * const completedReceptionWithIdOnly = await prisma.completedReception.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CompletedReceptionUpdateManyAndReturnArgs>(args: SelectSubset<T, CompletedReceptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompletedReceptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CompletedReception.
     * @param {CompletedReceptionUpsertArgs} args - Arguments to update or create a CompletedReception.
     * @example
     * // Update or create a CompletedReception
     * const completedReception = await prisma.completedReception.upsert({
     *   create: {
     *     // ... data to create a CompletedReception
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CompletedReception we want to update
     *   }
     * })
     */
    upsert<T extends CompletedReceptionUpsertArgs>(args: SelectSubset<T, CompletedReceptionUpsertArgs<ExtArgs>>): Prisma__CompletedReceptionClient<$Result.GetResult<Prisma.$CompletedReceptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CompletedReceptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedReceptionCountArgs} args - Arguments to filter CompletedReceptions to count.
     * @example
     * // Count the number of CompletedReceptions
     * const count = await prisma.completedReception.count({
     *   where: {
     *     // ... the filter for the CompletedReceptions we want to count
     *   }
     * })
    **/
    count<T extends CompletedReceptionCountArgs>(
      args?: Subset<T, CompletedReceptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompletedReceptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CompletedReception.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedReceptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompletedReceptionAggregateArgs>(args: Subset<T, CompletedReceptionAggregateArgs>): Prisma.PrismaPromise<GetCompletedReceptionAggregateType<T>>

    /**
     * Group by CompletedReception.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompletedReceptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompletedReceptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompletedReceptionGroupByArgs['orderBy'] }
        : { orderBy?: CompletedReceptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompletedReceptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompletedReceptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CompletedReception model
   */
  readonly fields: CompletedReceptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CompletedReception.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompletedReceptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CompletedReception model
   */
  interface CompletedReceptionFieldRefs {
    readonly id: FieldRef<"CompletedReception", 'String'>
    readonly lotNumber: FieldRef<"CompletedReception", 'String'>
    readonly volume: FieldRef<"CompletedReception", 'Float'>
    readonly protein: FieldRef<"CompletedReception", 'Float'>
    readonly fat: FieldRef<"CompletedReception", 'Float'>
    readonly milkType: FieldRef<"CompletedReception", 'String'>
    readonly deliveryDate: FieldRef<"CompletedReception", 'DateTime'>
    readonly completedAt: FieldRef<"CompletedReception", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CompletedReception findUnique
   */
  export type CompletedReceptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
    /**
     * Filter, which CompletedReception to fetch.
     */
    where: CompletedReceptionWhereUniqueInput
  }

  /**
   * CompletedReception findUniqueOrThrow
   */
  export type CompletedReceptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
    /**
     * Filter, which CompletedReception to fetch.
     */
    where: CompletedReceptionWhereUniqueInput
  }

  /**
   * CompletedReception findFirst
   */
  export type CompletedReceptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
    /**
     * Filter, which CompletedReception to fetch.
     */
    where?: CompletedReceptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompletedReceptions to fetch.
     */
    orderBy?: CompletedReceptionOrderByWithRelationInput | CompletedReceptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompletedReceptions.
     */
    cursor?: CompletedReceptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompletedReceptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompletedReceptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompletedReceptions.
     */
    distinct?: CompletedReceptionScalarFieldEnum | CompletedReceptionScalarFieldEnum[]
  }

  /**
   * CompletedReception findFirstOrThrow
   */
  export type CompletedReceptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
    /**
     * Filter, which CompletedReception to fetch.
     */
    where?: CompletedReceptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompletedReceptions to fetch.
     */
    orderBy?: CompletedReceptionOrderByWithRelationInput | CompletedReceptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompletedReceptions.
     */
    cursor?: CompletedReceptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompletedReceptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompletedReceptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompletedReceptions.
     */
    distinct?: CompletedReceptionScalarFieldEnum | CompletedReceptionScalarFieldEnum[]
  }

  /**
   * CompletedReception findMany
   */
  export type CompletedReceptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
    /**
     * Filter, which CompletedReceptions to fetch.
     */
    where?: CompletedReceptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompletedReceptions to fetch.
     */
    orderBy?: CompletedReceptionOrderByWithRelationInput | CompletedReceptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CompletedReceptions.
     */
    cursor?: CompletedReceptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompletedReceptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompletedReceptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompletedReceptions.
     */
    distinct?: CompletedReceptionScalarFieldEnum | CompletedReceptionScalarFieldEnum[]
  }

  /**
   * CompletedReception create
   */
  export type CompletedReceptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
    /**
     * The data needed to create a CompletedReception.
     */
    data: XOR<CompletedReceptionCreateInput, CompletedReceptionUncheckedCreateInput>
  }

  /**
   * CompletedReception createMany
   */
  export type CompletedReceptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CompletedReceptions.
     */
    data: CompletedReceptionCreateManyInput | CompletedReceptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompletedReception createManyAndReturn
   */
  export type CompletedReceptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
    /**
     * The data used to create many CompletedReceptions.
     */
    data: CompletedReceptionCreateManyInput | CompletedReceptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompletedReception update
   */
  export type CompletedReceptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
    /**
     * The data needed to update a CompletedReception.
     */
    data: XOR<CompletedReceptionUpdateInput, CompletedReceptionUncheckedUpdateInput>
    /**
     * Choose, which CompletedReception to update.
     */
    where: CompletedReceptionWhereUniqueInput
  }

  /**
   * CompletedReception updateMany
   */
  export type CompletedReceptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CompletedReceptions.
     */
    data: XOR<CompletedReceptionUpdateManyMutationInput, CompletedReceptionUncheckedUpdateManyInput>
    /**
     * Filter which CompletedReceptions to update
     */
    where?: CompletedReceptionWhereInput
    /**
     * Limit how many CompletedReceptions to update.
     */
    limit?: number
  }

  /**
   * CompletedReception updateManyAndReturn
   */
  export type CompletedReceptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
    /**
     * The data used to update CompletedReceptions.
     */
    data: XOR<CompletedReceptionUpdateManyMutationInput, CompletedReceptionUncheckedUpdateManyInput>
    /**
     * Filter which CompletedReceptions to update
     */
    where?: CompletedReceptionWhereInput
    /**
     * Limit how many CompletedReceptions to update.
     */
    limit?: number
  }

  /**
   * CompletedReception upsert
   */
  export type CompletedReceptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
    /**
     * The filter to search for the CompletedReception to update in case it exists.
     */
    where: CompletedReceptionWhereUniqueInput
    /**
     * In case the CompletedReception found by the `where` argument doesn't exist, create a new CompletedReception with this data.
     */
    create: XOR<CompletedReceptionCreateInput, CompletedReceptionUncheckedCreateInput>
    /**
     * In case the CompletedReception was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompletedReceptionUpdateInput, CompletedReceptionUncheckedUpdateInput>
  }

  /**
   * CompletedReception delete
   */
  export type CompletedReceptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
    /**
     * Filter which CompletedReception to delete.
     */
    where: CompletedReceptionWhereUniqueInput
  }

  /**
   * CompletedReception deleteMany
   */
  export type CompletedReceptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompletedReceptions to delete
     */
    where?: CompletedReceptionWhereInput
    /**
     * Limit how many CompletedReceptions to delete.
     */
    limit?: number
  }

  /**
   * CompletedReception without action
   */
  export type CompletedReceptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompletedReception
     */
    select?: CompletedReceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompletedReception
     */
    omit?: CompletedReceptionOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CompletedCommandScalarFieldEnum: {
    id: 'id',
    name: 'name',
    status: 'status',
    whiteMassKg: 'whiteMassKg',
    milkReceivedVolume: 'milkReceivedVolume',
    targetValue: 'targetValue',
    osmosedVolume: 'osmosedVolume',
    milkType: 'milkType',
    isSkyr: 'isSkyr',
    completedAt: 'completedAt'
  };

  export type CompletedCommandScalarFieldEnum = (typeof CompletedCommandScalarFieldEnum)[keyof typeof CompletedCommandScalarFieldEnum]


  export const ReferenceScalarFieldEnum: {
    id: 'id',
    commandId: 'commandId',
    name: 'name',
    potsQty: 'potsQty',
    gramPerPot: 'gramPerPot'
  };

  export type ReferenceScalarFieldEnum = (typeof ReferenceScalarFieldEnum)[keyof typeof ReferenceScalarFieldEnum]


  export const CompletedReceptionScalarFieldEnum: {
    id: 'id',
    lotNumber: 'lotNumber',
    volume: 'volume',
    protein: 'protein',
    fat: 'fat',
    milkType: 'milkType',
    deliveryDate: 'deliveryDate',
    completedAt: 'completedAt'
  };

  export type CompletedReceptionScalarFieldEnum = (typeof CompletedReceptionScalarFieldEnum)[keyof typeof CompletedReceptionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type CompletedCommandWhereInput = {
    AND?: CompletedCommandWhereInput | CompletedCommandWhereInput[]
    OR?: CompletedCommandWhereInput[]
    NOT?: CompletedCommandWhereInput | CompletedCommandWhereInput[]
    id?: StringFilter<"CompletedCommand"> | string
    name?: StringFilter<"CompletedCommand"> | string
    status?: StringFilter<"CompletedCommand"> | string
    whiteMassKg?: FloatFilter<"CompletedCommand"> | number
    milkReceivedVolume?: FloatFilter<"CompletedCommand"> | number
    targetValue?: FloatFilter<"CompletedCommand"> | number
    osmosedVolume?: FloatFilter<"CompletedCommand"> | number
    milkType?: StringFilter<"CompletedCommand"> | string
    isSkyr?: BoolFilter<"CompletedCommand"> | boolean
    completedAt?: DateTimeFilter<"CompletedCommand"> | Date | string
    references?: ReferenceListRelationFilter
  }

  export type CompletedCommandOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    whiteMassKg?: SortOrder
    milkReceivedVolume?: SortOrder
    targetValue?: SortOrder
    osmosedVolume?: SortOrder
    milkType?: SortOrder
    isSkyr?: SortOrder
    completedAt?: SortOrder
    references?: ReferenceOrderByRelationAggregateInput
  }

  export type CompletedCommandWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CompletedCommandWhereInput | CompletedCommandWhereInput[]
    OR?: CompletedCommandWhereInput[]
    NOT?: CompletedCommandWhereInput | CompletedCommandWhereInput[]
    name?: StringFilter<"CompletedCommand"> | string
    status?: StringFilter<"CompletedCommand"> | string
    whiteMassKg?: FloatFilter<"CompletedCommand"> | number
    milkReceivedVolume?: FloatFilter<"CompletedCommand"> | number
    targetValue?: FloatFilter<"CompletedCommand"> | number
    osmosedVolume?: FloatFilter<"CompletedCommand"> | number
    milkType?: StringFilter<"CompletedCommand"> | string
    isSkyr?: BoolFilter<"CompletedCommand"> | boolean
    completedAt?: DateTimeFilter<"CompletedCommand"> | Date | string
    references?: ReferenceListRelationFilter
  }, "id">

  export type CompletedCommandOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    whiteMassKg?: SortOrder
    milkReceivedVolume?: SortOrder
    targetValue?: SortOrder
    osmosedVolume?: SortOrder
    milkType?: SortOrder
    isSkyr?: SortOrder
    completedAt?: SortOrder
    _count?: CompletedCommandCountOrderByAggregateInput
    _avg?: CompletedCommandAvgOrderByAggregateInput
    _max?: CompletedCommandMaxOrderByAggregateInput
    _min?: CompletedCommandMinOrderByAggregateInput
    _sum?: CompletedCommandSumOrderByAggregateInput
  }

  export type CompletedCommandScalarWhereWithAggregatesInput = {
    AND?: CompletedCommandScalarWhereWithAggregatesInput | CompletedCommandScalarWhereWithAggregatesInput[]
    OR?: CompletedCommandScalarWhereWithAggregatesInput[]
    NOT?: CompletedCommandScalarWhereWithAggregatesInput | CompletedCommandScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CompletedCommand"> | string
    name?: StringWithAggregatesFilter<"CompletedCommand"> | string
    status?: StringWithAggregatesFilter<"CompletedCommand"> | string
    whiteMassKg?: FloatWithAggregatesFilter<"CompletedCommand"> | number
    milkReceivedVolume?: FloatWithAggregatesFilter<"CompletedCommand"> | number
    targetValue?: FloatWithAggregatesFilter<"CompletedCommand"> | number
    osmosedVolume?: FloatWithAggregatesFilter<"CompletedCommand"> | number
    milkType?: StringWithAggregatesFilter<"CompletedCommand"> | string
    isSkyr?: BoolWithAggregatesFilter<"CompletedCommand"> | boolean
    completedAt?: DateTimeWithAggregatesFilter<"CompletedCommand"> | Date | string
  }

  export type ReferenceWhereInput = {
    AND?: ReferenceWhereInput | ReferenceWhereInput[]
    OR?: ReferenceWhereInput[]
    NOT?: ReferenceWhereInput | ReferenceWhereInput[]
    id?: StringFilter<"Reference"> | string
    commandId?: StringFilter<"Reference"> | string
    name?: StringFilter<"Reference"> | string
    potsQty?: IntFilter<"Reference"> | number
    gramPerPot?: FloatFilter<"Reference"> | number
    command?: XOR<CompletedCommandScalarRelationFilter, CompletedCommandWhereInput>
  }

  export type ReferenceOrderByWithRelationInput = {
    id?: SortOrder
    commandId?: SortOrder
    name?: SortOrder
    potsQty?: SortOrder
    gramPerPot?: SortOrder
    command?: CompletedCommandOrderByWithRelationInput
  }

  export type ReferenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReferenceWhereInput | ReferenceWhereInput[]
    OR?: ReferenceWhereInput[]
    NOT?: ReferenceWhereInput | ReferenceWhereInput[]
    commandId?: StringFilter<"Reference"> | string
    name?: StringFilter<"Reference"> | string
    potsQty?: IntFilter<"Reference"> | number
    gramPerPot?: FloatFilter<"Reference"> | number
    command?: XOR<CompletedCommandScalarRelationFilter, CompletedCommandWhereInput>
  }, "id">

  export type ReferenceOrderByWithAggregationInput = {
    id?: SortOrder
    commandId?: SortOrder
    name?: SortOrder
    potsQty?: SortOrder
    gramPerPot?: SortOrder
    _count?: ReferenceCountOrderByAggregateInput
    _avg?: ReferenceAvgOrderByAggregateInput
    _max?: ReferenceMaxOrderByAggregateInput
    _min?: ReferenceMinOrderByAggregateInput
    _sum?: ReferenceSumOrderByAggregateInput
  }

  export type ReferenceScalarWhereWithAggregatesInput = {
    AND?: ReferenceScalarWhereWithAggregatesInput | ReferenceScalarWhereWithAggregatesInput[]
    OR?: ReferenceScalarWhereWithAggregatesInput[]
    NOT?: ReferenceScalarWhereWithAggregatesInput | ReferenceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reference"> | string
    commandId?: StringWithAggregatesFilter<"Reference"> | string
    name?: StringWithAggregatesFilter<"Reference"> | string
    potsQty?: IntWithAggregatesFilter<"Reference"> | number
    gramPerPot?: FloatWithAggregatesFilter<"Reference"> | number
  }

  export type CompletedReceptionWhereInput = {
    AND?: CompletedReceptionWhereInput | CompletedReceptionWhereInput[]
    OR?: CompletedReceptionWhereInput[]
    NOT?: CompletedReceptionWhereInput | CompletedReceptionWhereInput[]
    id?: StringFilter<"CompletedReception"> | string
    lotNumber?: StringFilter<"CompletedReception"> | string
    volume?: FloatFilter<"CompletedReception"> | number
    protein?: FloatFilter<"CompletedReception"> | number
    fat?: FloatFilter<"CompletedReception"> | number
    milkType?: StringFilter<"CompletedReception"> | string
    deliveryDate?: DateTimeFilter<"CompletedReception"> | Date | string
    completedAt?: DateTimeFilter<"CompletedReception"> | Date | string
  }

  export type CompletedReceptionOrderByWithRelationInput = {
    id?: SortOrder
    lotNumber?: SortOrder
    volume?: SortOrder
    protein?: SortOrder
    fat?: SortOrder
    milkType?: SortOrder
    deliveryDate?: SortOrder
    completedAt?: SortOrder
  }

  export type CompletedReceptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CompletedReceptionWhereInput | CompletedReceptionWhereInput[]
    OR?: CompletedReceptionWhereInput[]
    NOT?: CompletedReceptionWhereInput | CompletedReceptionWhereInput[]
    lotNumber?: StringFilter<"CompletedReception"> | string
    volume?: FloatFilter<"CompletedReception"> | number
    protein?: FloatFilter<"CompletedReception"> | number
    fat?: FloatFilter<"CompletedReception"> | number
    milkType?: StringFilter<"CompletedReception"> | string
    deliveryDate?: DateTimeFilter<"CompletedReception"> | Date | string
    completedAt?: DateTimeFilter<"CompletedReception"> | Date | string
  }, "id">

  export type CompletedReceptionOrderByWithAggregationInput = {
    id?: SortOrder
    lotNumber?: SortOrder
    volume?: SortOrder
    protein?: SortOrder
    fat?: SortOrder
    milkType?: SortOrder
    deliveryDate?: SortOrder
    completedAt?: SortOrder
    _count?: CompletedReceptionCountOrderByAggregateInput
    _avg?: CompletedReceptionAvgOrderByAggregateInput
    _max?: CompletedReceptionMaxOrderByAggregateInput
    _min?: CompletedReceptionMinOrderByAggregateInput
    _sum?: CompletedReceptionSumOrderByAggregateInput
  }

  export type CompletedReceptionScalarWhereWithAggregatesInput = {
    AND?: CompletedReceptionScalarWhereWithAggregatesInput | CompletedReceptionScalarWhereWithAggregatesInput[]
    OR?: CompletedReceptionScalarWhereWithAggregatesInput[]
    NOT?: CompletedReceptionScalarWhereWithAggregatesInput | CompletedReceptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CompletedReception"> | string
    lotNumber?: StringWithAggregatesFilter<"CompletedReception"> | string
    volume?: FloatWithAggregatesFilter<"CompletedReception"> | number
    protein?: FloatWithAggregatesFilter<"CompletedReception"> | number
    fat?: FloatWithAggregatesFilter<"CompletedReception"> | number
    milkType?: StringWithAggregatesFilter<"CompletedReception"> | string
    deliveryDate?: DateTimeWithAggregatesFilter<"CompletedReception"> | Date | string
    completedAt?: DateTimeWithAggregatesFilter<"CompletedReception"> | Date | string
  }

  export type CompletedCommandCreateInput = {
    id?: string
    name: string
    status: string
    whiteMassKg: number
    milkReceivedVolume: number
    targetValue: number
    osmosedVolume: number
    milkType: string
    isSkyr: boolean
    completedAt?: Date | string
    references?: ReferenceCreateNestedManyWithoutCommandInput
  }

  export type CompletedCommandUncheckedCreateInput = {
    id?: string
    name: string
    status: string
    whiteMassKg: number
    milkReceivedVolume: number
    targetValue: number
    osmosedVolume: number
    milkType: string
    isSkyr: boolean
    completedAt?: Date | string
    references?: ReferenceUncheckedCreateNestedManyWithoutCommandInput
  }

  export type CompletedCommandUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    whiteMassKg?: FloatFieldUpdateOperationsInput | number
    milkReceivedVolume?: FloatFieldUpdateOperationsInput | number
    targetValue?: FloatFieldUpdateOperationsInput | number
    osmosedVolume?: FloatFieldUpdateOperationsInput | number
    milkType?: StringFieldUpdateOperationsInput | string
    isSkyr?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    references?: ReferenceUpdateManyWithoutCommandNestedInput
  }

  export type CompletedCommandUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    whiteMassKg?: FloatFieldUpdateOperationsInput | number
    milkReceivedVolume?: FloatFieldUpdateOperationsInput | number
    targetValue?: FloatFieldUpdateOperationsInput | number
    osmosedVolume?: FloatFieldUpdateOperationsInput | number
    milkType?: StringFieldUpdateOperationsInput | string
    isSkyr?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    references?: ReferenceUncheckedUpdateManyWithoutCommandNestedInput
  }

  export type CompletedCommandCreateManyInput = {
    id?: string
    name: string
    status: string
    whiteMassKg: number
    milkReceivedVolume: number
    targetValue: number
    osmosedVolume: number
    milkType: string
    isSkyr: boolean
    completedAt?: Date | string
  }

  export type CompletedCommandUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    whiteMassKg?: FloatFieldUpdateOperationsInput | number
    milkReceivedVolume?: FloatFieldUpdateOperationsInput | number
    targetValue?: FloatFieldUpdateOperationsInput | number
    osmosedVolume?: FloatFieldUpdateOperationsInput | number
    milkType?: StringFieldUpdateOperationsInput | string
    isSkyr?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompletedCommandUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    whiteMassKg?: FloatFieldUpdateOperationsInput | number
    milkReceivedVolume?: FloatFieldUpdateOperationsInput | number
    targetValue?: FloatFieldUpdateOperationsInput | number
    osmosedVolume?: FloatFieldUpdateOperationsInput | number
    milkType?: StringFieldUpdateOperationsInput | string
    isSkyr?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferenceCreateInput = {
    id?: string
    name: string
    potsQty: number
    gramPerPot: number
    command: CompletedCommandCreateNestedOneWithoutReferencesInput
  }

  export type ReferenceUncheckedCreateInput = {
    id?: string
    commandId: string
    name: string
    potsQty: number
    gramPerPot: number
  }

  export type ReferenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    potsQty?: IntFieldUpdateOperationsInput | number
    gramPerPot?: FloatFieldUpdateOperationsInput | number
    command?: CompletedCommandUpdateOneRequiredWithoutReferencesNestedInput
  }

  export type ReferenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    commandId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    potsQty?: IntFieldUpdateOperationsInput | number
    gramPerPot?: FloatFieldUpdateOperationsInput | number
  }

  export type ReferenceCreateManyInput = {
    id?: string
    commandId: string
    name: string
    potsQty: number
    gramPerPot: number
  }

  export type ReferenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    potsQty?: IntFieldUpdateOperationsInput | number
    gramPerPot?: FloatFieldUpdateOperationsInput | number
  }

  export type ReferenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    commandId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    potsQty?: IntFieldUpdateOperationsInput | number
    gramPerPot?: FloatFieldUpdateOperationsInput | number
  }

  export type CompletedReceptionCreateInput = {
    id?: string
    lotNumber: string
    volume: number
    protein: number
    fat: number
    milkType: string
    deliveryDate: Date | string
    completedAt?: Date | string
  }

  export type CompletedReceptionUncheckedCreateInput = {
    id?: string
    lotNumber: string
    volume: number
    protein: number
    fat: number
    milkType: string
    deliveryDate: Date | string
    completedAt?: Date | string
  }

  export type CompletedReceptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lotNumber?: StringFieldUpdateOperationsInput | string
    volume?: FloatFieldUpdateOperationsInput | number
    protein?: FloatFieldUpdateOperationsInput | number
    fat?: FloatFieldUpdateOperationsInput | number
    milkType?: StringFieldUpdateOperationsInput | string
    deliveryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompletedReceptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lotNumber?: StringFieldUpdateOperationsInput | string
    volume?: FloatFieldUpdateOperationsInput | number
    protein?: FloatFieldUpdateOperationsInput | number
    fat?: FloatFieldUpdateOperationsInput | number
    milkType?: StringFieldUpdateOperationsInput | string
    deliveryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompletedReceptionCreateManyInput = {
    id?: string
    lotNumber: string
    volume: number
    protein: number
    fat: number
    milkType: string
    deliveryDate: Date | string
    completedAt?: Date | string
  }

  export type CompletedReceptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lotNumber?: StringFieldUpdateOperationsInput | string
    volume?: FloatFieldUpdateOperationsInput | number
    protein?: FloatFieldUpdateOperationsInput | number
    fat?: FloatFieldUpdateOperationsInput | number
    milkType?: StringFieldUpdateOperationsInput | string
    deliveryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompletedReceptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    lotNumber?: StringFieldUpdateOperationsInput | string
    volume?: FloatFieldUpdateOperationsInput | number
    protein?: FloatFieldUpdateOperationsInput | number
    fat?: FloatFieldUpdateOperationsInput | number
    milkType?: StringFieldUpdateOperationsInput | string
    deliveryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ReferenceListRelationFilter = {
    every?: ReferenceWhereInput
    some?: ReferenceWhereInput
    none?: ReferenceWhereInput
  }

  export type ReferenceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompletedCommandCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    whiteMassKg?: SortOrder
    milkReceivedVolume?: SortOrder
    targetValue?: SortOrder
    osmosedVolume?: SortOrder
    milkType?: SortOrder
    isSkyr?: SortOrder
    completedAt?: SortOrder
  }

  export type CompletedCommandAvgOrderByAggregateInput = {
    whiteMassKg?: SortOrder
    milkReceivedVolume?: SortOrder
    targetValue?: SortOrder
    osmosedVolume?: SortOrder
  }

  export type CompletedCommandMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    whiteMassKg?: SortOrder
    milkReceivedVolume?: SortOrder
    targetValue?: SortOrder
    osmosedVolume?: SortOrder
    milkType?: SortOrder
    isSkyr?: SortOrder
    completedAt?: SortOrder
  }

  export type CompletedCommandMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    whiteMassKg?: SortOrder
    milkReceivedVolume?: SortOrder
    targetValue?: SortOrder
    osmosedVolume?: SortOrder
    milkType?: SortOrder
    isSkyr?: SortOrder
    completedAt?: SortOrder
  }

  export type CompletedCommandSumOrderByAggregateInput = {
    whiteMassKg?: SortOrder
    milkReceivedVolume?: SortOrder
    targetValue?: SortOrder
    osmosedVolume?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type CompletedCommandScalarRelationFilter = {
    is?: CompletedCommandWhereInput
    isNot?: CompletedCommandWhereInput
  }

  export type ReferenceCountOrderByAggregateInput = {
    id?: SortOrder
    commandId?: SortOrder
    name?: SortOrder
    potsQty?: SortOrder
    gramPerPot?: SortOrder
  }

  export type ReferenceAvgOrderByAggregateInput = {
    potsQty?: SortOrder
    gramPerPot?: SortOrder
  }

  export type ReferenceMaxOrderByAggregateInput = {
    id?: SortOrder
    commandId?: SortOrder
    name?: SortOrder
    potsQty?: SortOrder
    gramPerPot?: SortOrder
  }

  export type ReferenceMinOrderByAggregateInput = {
    id?: SortOrder
    commandId?: SortOrder
    name?: SortOrder
    potsQty?: SortOrder
    gramPerPot?: SortOrder
  }

  export type ReferenceSumOrderByAggregateInput = {
    potsQty?: SortOrder
    gramPerPot?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type CompletedReceptionCountOrderByAggregateInput = {
    id?: SortOrder
    lotNumber?: SortOrder
    volume?: SortOrder
    protein?: SortOrder
    fat?: SortOrder
    milkType?: SortOrder
    deliveryDate?: SortOrder
    completedAt?: SortOrder
  }

  export type CompletedReceptionAvgOrderByAggregateInput = {
    volume?: SortOrder
    protein?: SortOrder
    fat?: SortOrder
  }

  export type CompletedReceptionMaxOrderByAggregateInput = {
    id?: SortOrder
    lotNumber?: SortOrder
    volume?: SortOrder
    protein?: SortOrder
    fat?: SortOrder
    milkType?: SortOrder
    deliveryDate?: SortOrder
    completedAt?: SortOrder
  }

  export type CompletedReceptionMinOrderByAggregateInput = {
    id?: SortOrder
    lotNumber?: SortOrder
    volume?: SortOrder
    protein?: SortOrder
    fat?: SortOrder
    milkType?: SortOrder
    deliveryDate?: SortOrder
    completedAt?: SortOrder
  }

  export type CompletedReceptionSumOrderByAggregateInput = {
    volume?: SortOrder
    protein?: SortOrder
    fat?: SortOrder
  }

  export type ReferenceCreateNestedManyWithoutCommandInput = {
    create?: XOR<ReferenceCreateWithoutCommandInput, ReferenceUncheckedCreateWithoutCommandInput> | ReferenceCreateWithoutCommandInput[] | ReferenceUncheckedCreateWithoutCommandInput[]
    connectOrCreate?: ReferenceCreateOrConnectWithoutCommandInput | ReferenceCreateOrConnectWithoutCommandInput[]
    createMany?: ReferenceCreateManyCommandInputEnvelope
    connect?: ReferenceWhereUniqueInput | ReferenceWhereUniqueInput[]
  }

  export type ReferenceUncheckedCreateNestedManyWithoutCommandInput = {
    create?: XOR<ReferenceCreateWithoutCommandInput, ReferenceUncheckedCreateWithoutCommandInput> | ReferenceCreateWithoutCommandInput[] | ReferenceUncheckedCreateWithoutCommandInput[]
    connectOrCreate?: ReferenceCreateOrConnectWithoutCommandInput | ReferenceCreateOrConnectWithoutCommandInput[]
    createMany?: ReferenceCreateManyCommandInputEnvelope
    connect?: ReferenceWhereUniqueInput | ReferenceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ReferenceUpdateManyWithoutCommandNestedInput = {
    create?: XOR<ReferenceCreateWithoutCommandInput, ReferenceUncheckedCreateWithoutCommandInput> | ReferenceCreateWithoutCommandInput[] | ReferenceUncheckedCreateWithoutCommandInput[]
    connectOrCreate?: ReferenceCreateOrConnectWithoutCommandInput | ReferenceCreateOrConnectWithoutCommandInput[]
    upsert?: ReferenceUpsertWithWhereUniqueWithoutCommandInput | ReferenceUpsertWithWhereUniqueWithoutCommandInput[]
    createMany?: ReferenceCreateManyCommandInputEnvelope
    set?: ReferenceWhereUniqueInput | ReferenceWhereUniqueInput[]
    disconnect?: ReferenceWhereUniqueInput | ReferenceWhereUniqueInput[]
    delete?: ReferenceWhereUniqueInput | ReferenceWhereUniqueInput[]
    connect?: ReferenceWhereUniqueInput | ReferenceWhereUniqueInput[]
    update?: ReferenceUpdateWithWhereUniqueWithoutCommandInput | ReferenceUpdateWithWhereUniqueWithoutCommandInput[]
    updateMany?: ReferenceUpdateManyWithWhereWithoutCommandInput | ReferenceUpdateManyWithWhereWithoutCommandInput[]
    deleteMany?: ReferenceScalarWhereInput | ReferenceScalarWhereInput[]
  }

  export type ReferenceUncheckedUpdateManyWithoutCommandNestedInput = {
    create?: XOR<ReferenceCreateWithoutCommandInput, ReferenceUncheckedCreateWithoutCommandInput> | ReferenceCreateWithoutCommandInput[] | ReferenceUncheckedCreateWithoutCommandInput[]
    connectOrCreate?: ReferenceCreateOrConnectWithoutCommandInput | ReferenceCreateOrConnectWithoutCommandInput[]
    upsert?: ReferenceUpsertWithWhereUniqueWithoutCommandInput | ReferenceUpsertWithWhereUniqueWithoutCommandInput[]
    createMany?: ReferenceCreateManyCommandInputEnvelope
    set?: ReferenceWhereUniqueInput | ReferenceWhereUniqueInput[]
    disconnect?: ReferenceWhereUniqueInput | ReferenceWhereUniqueInput[]
    delete?: ReferenceWhereUniqueInput | ReferenceWhereUniqueInput[]
    connect?: ReferenceWhereUniqueInput | ReferenceWhereUniqueInput[]
    update?: ReferenceUpdateWithWhereUniqueWithoutCommandInput | ReferenceUpdateWithWhereUniqueWithoutCommandInput[]
    updateMany?: ReferenceUpdateManyWithWhereWithoutCommandInput | ReferenceUpdateManyWithWhereWithoutCommandInput[]
    deleteMany?: ReferenceScalarWhereInput | ReferenceScalarWhereInput[]
  }

  export type CompletedCommandCreateNestedOneWithoutReferencesInput = {
    create?: XOR<CompletedCommandCreateWithoutReferencesInput, CompletedCommandUncheckedCreateWithoutReferencesInput>
    connectOrCreate?: CompletedCommandCreateOrConnectWithoutReferencesInput
    connect?: CompletedCommandWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CompletedCommandUpdateOneRequiredWithoutReferencesNestedInput = {
    create?: XOR<CompletedCommandCreateWithoutReferencesInput, CompletedCommandUncheckedCreateWithoutReferencesInput>
    connectOrCreate?: CompletedCommandCreateOrConnectWithoutReferencesInput
    upsert?: CompletedCommandUpsertWithoutReferencesInput
    connect?: CompletedCommandWhereUniqueInput
    update?: XOR<XOR<CompletedCommandUpdateToOneWithWhereWithoutReferencesInput, CompletedCommandUpdateWithoutReferencesInput>, CompletedCommandUncheckedUpdateWithoutReferencesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ReferenceCreateWithoutCommandInput = {
    id?: string
    name: string
    potsQty: number
    gramPerPot: number
  }

  export type ReferenceUncheckedCreateWithoutCommandInput = {
    id?: string
    name: string
    potsQty: number
    gramPerPot: number
  }

  export type ReferenceCreateOrConnectWithoutCommandInput = {
    where: ReferenceWhereUniqueInput
    create: XOR<ReferenceCreateWithoutCommandInput, ReferenceUncheckedCreateWithoutCommandInput>
  }

  export type ReferenceCreateManyCommandInputEnvelope = {
    data: ReferenceCreateManyCommandInput | ReferenceCreateManyCommandInput[]
    skipDuplicates?: boolean
  }

  export type ReferenceUpsertWithWhereUniqueWithoutCommandInput = {
    where: ReferenceWhereUniqueInput
    update: XOR<ReferenceUpdateWithoutCommandInput, ReferenceUncheckedUpdateWithoutCommandInput>
    create: XOR<ReferenceCreateWithoutCommandInput, ReferenceUncheckedCreateWithoutCommandInput>
  }

  export type ReferenceUpdateWithWhereUniqueWithoutCommandInput = {
    where: ReferenceWhereUniqueInput
    data: XOR<ReferenceUpdateWithoutCommandInput, ReferenceUncheckedUpdateWithoutCommandInput>
  }

  export type ReferenceUpdateManyWithWhereWithoutCommandInput = {
    where: ReferenceScalarWhereInput
    data: XOR<ReferenceUpdateManyMutationInput, ReferenceUncheckedUpdateManyWithoutCommandInput>
  }

  export type ReferenceScalarWhereInput = {
    AND?: ReferenceScalarWhereInput | ReferenceScalarWhereInput[]
    OR?: ReferenceScalarWhereInput[]
    NOT?: ReferenceScalarWhereInput | ReferenceScalarWhereInput[]
    id?: StringFilter<"Reference"> | string
    commandId?: StringFilter<"Reference"> | string
    name?: StringFilter<"Reference"> | string
    potsQty?: IntFilter<"Reference"> | number
    gramPerPot?: FloatFilter<"Reference"> | number
  }

  export type CompletedCommandCreateWithoutReferencesInput = {
    id?: string
    name: string
    status: string
    whiteMassKg: number
    milkReceivedVolume: number
    targetValue: number
    osmosedVolume: number
    milkType: string
    isSkyr: boolean
    completedAt?: Date | string
  }

  export type CompletedCommandUncheckedCreateWithoutReferencesInput = {
    id?: string
    name: string
    status: string
    whiteMassKg: number
    milkReceivedVolume: number
    targetValue: number
    osmosedVolume: number
    milkType: string
    isSkyr: boolean
    completedAt?: Date | string
  }

  export type CompletedCommandCreateOrConnectWithoutReferencesInput = {
    where: CompletedCommandWhereUniqueInput
    create: XOR<CompletedCommandCreateWithoutReferencesInput, CompletedCommandUncheckedCreateWithoutReferencesInput>
  }

  export type CompletedCommandUpsertWithoutReferencesInput = {
    update: XOR<CompletedCommandUpdateWithoutReferencesInput, CompletedCommandUncheckedUpdateWithoutReferencesInput>
    create: XOR<CompletedCommandCreateWithoutReferencesInput, CompletedCommandUncheckedCreateWithoutReferencesInput>
    where?: CompletedCommandWhereInput
  }

  export type CompletedCommandUpdateToOneWithWhereWithoutReferencesInput = {
    where?: CompletedCommandWhereInput
    data: XOR<CompletedCommandUpdateWithoutReferencesInput, CompletedCommandUncheckedUpdateWithoutReferencesInput>
  }

  export type CompletedCommandUpdateWithoutReferencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    whiteMassKg?: FloatFieldUpdateOperationsInput | number
    milkReceivedVolume?: FloatFieldUpdateOperationsInput | number
    targetValue?: FloatFieldUpdateOperationsInput | number
    osmosedVolume?: FloatFieldUpdateOperationsInput | number
    milkType?: StringFieldUpdateOperationsInput | string
    isSkyr?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompletedCommandUncheckedUpdateWithoutReferencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    whiteMassKg?: FloatFieldUpdateOperationsInput | number
    milkReceivedVolume?: FloatFieldUpdateOperationsInput | number
    targetValue?: FloatFieldUpdateOperationsInput | number
    osmosedVolume?: FloatFieldUpdateOperationsInput | number
    milkType?: StringFieldUpdateOperationsInput | string
    isSkyr?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferenceCreateManyCommandInput = {
    id?: string
    name: string
    potsQty: number
    gramPerPot: number
  }

  export type ReferenceUpdateWithoutCommandInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    potsQty?: IntFieldUpdateOperationsInput | number
    gramPerPot?: FloatFieldUpdateOperationsInput | number
  }

  export type ReferenceUncheckedUpdateWithoutCommandInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    potsQty?: IntFieldUpdateOperationsInput | number
    gramPerPot?: FloatFieldUpdateOperationsInput | number
  }

  export type ReferenceUncheckedUpdateManyWithoutCommandInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    potsQty?: IntFieldUpdateOperationsInput | number
    gramPerPot?: FloatFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}