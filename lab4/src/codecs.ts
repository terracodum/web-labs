import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as t from "io-ts";
import { failure } from "io-ts/PathReporter";

const Localized = t.type({ en: t.string });
const DateValue = t.type({ date: t.string });
const Meta = t.type({ offset: t.number, limit: t.number, count: t.number });

export const PrizesResponseCodec = t.type({
  nobelPrizes: t.array(
    t.type({ categoryFullName: Localized, dateAwarded: t.string, prizeAmount: t.number }),
  ),
  meta: Meta,
});

export const LaureatesResponseCodec = t.type({
  laureates: t.array(
    t.partial({
      knownName: Localized,
      orgName: Localized,
      birth: DateValue,
      founded: DateValue,
      nobelPrizes: t.array(t.unknown),
    }),
  ),
  meta: Meta,
});

export function decodeOrThrow<A>(codec: t.Decoder<unknown, A>, input: unknown): A {
  return pipe(
    codec.decode(input),
    fold(
      (errors) => {
        throw new Error(`Неверный формат данных API:\n${failure(errors).join("\n")}`);
      },
      (value) => value,
    ),
  );
}
