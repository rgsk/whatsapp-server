import { mapSchema, MapperKind, getDirective } from "@graphql-tools/utils";
import { defaultFieldResolver, GraphQLSchema } from "graphql";

export const loggerDirective = (
  schema: GraphQLSchema,
  directiveName: string
) => {
  return mapSchema(schema, {
    [MapperKind.FIELD]: (fieldConfig: any) => {
      const loggerDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];
      if (loggerDirective) {
        console.log(fieldConfig);
        const defaultResolver = fieldConfig.resolve || defaultFieldResolver;
        const resolver = (...args: any) => {
          console.log(fieldConfig);
          return defaultResolver.call(this, ...args);
        };
        fieldConfig.resolve = resolver;
        return fieldConfig;
      }
    },
  });
};

export const upperCaseDirective = (
  schema: GraphQLSchema,
  directiveName: string
) => {
  return mapSchema(schema, {
    [MapperKind.FIELD]: (fieldConfig: any) => {
      const upperCaseDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];
      if (upperCaseDirective) {
        const defaultResolver = fieldConfig.resolve || defaultFieldResolver;
        const resolver = async (...args: any) => {
          const answer = await defaultResolver.call(this, ...args);
          console.log(answer);
          return answer.toUpperCase();
        };
        fieldConfig.resolve = resolver;
        return fieldConfig;
      }
    },
  });
};
