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
        const defaultResolver = fieldConfig.resolve || defaultFieldResolver;
        // console.log(loggerDirective);
        // console.log(loggerDirective.text)
        fieldConfig.resolve = (...args: any) => {
          return defaultResolver.call(this, ...args);
        };
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
        fieldConfig.resolve = async (...args: any) => {
          const answer = await defaultResolver.call(this, ...args);
          // console.log(answer);
          return answer.toUpperCase();
        };
        return fieldConfig;
      }
    },
  });
};
