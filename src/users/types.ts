import { t } from "elysia";

export const ID_TYPES = {
  uuid: "uuid",
  plain: "plain",
  objectid: "objectid",
} as const;

export type IdType = (typeof ID_TYPES)[keyof typeof ID_TYPES];

export const users_schema = {
  query: t.Object({
    limit: t.Optional(t.Numeric()),
    page: t.Optional(t.Numeric()),
    total: t.Optional(t.Numeric()),
    id_type: t.Optional(t.String({ enum: Object.values(ID_TYPES) })),
  }),
};

export const user_schema = {
  params: t.Object({
    id: t.Numeric(),
  }),
};
