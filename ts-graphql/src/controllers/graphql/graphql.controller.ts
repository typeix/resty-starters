import {
  addRequestInterceptor,
  BodyAsBufferInterceptor,
  Controller,
  Inject,
  Injector,
  POST,
  RouterError
} from "@typeix/resty";
import {PermissionResolver} from "~/controllers/graphql/permission.resolver";
import {UserResolver} from "~/controllers/graphql/user.resolver";
import {GraphQLConfig} from "~/controllers/graphql/graphql.config";
import {graphql, parse, Source, specifiedRules, validate} from "graphql";

@Controller({
  path: "/graphql",
  providers: [PermissionResolver, UserResolver],
  interceptors: []
})
export class GraphQLController {

  @Inject() graphQlConfig: GraphQLConfig;
  @Inject() injector: Injector;

  @POST()
  @addRequestInterceptor(BodyAsBufferInterceptor)
  processGraphQL(@Inject() body: Buffer) {
    let schema = this.graphQlConfig.getSchema();
    let {query, operationName, variables} = this.graphQlConfig.parseBody(body);
    let source = new Source(query, operationName);
    let documentAST = parse(source);
    let validationErrors = validate(schema, documentAST, specifiedRules);
    if (validationErrors.length > 0) {
      for (let error of validationErrors) {
        throw RouterError.from(error, 400);
      }
    }
    return graphql(
      {
        schema: schema,
        source: source,
        rootValue: null,
        contextValue: {
          container: this.injector
        },
        variableValues: variables,
        operationName: operationName
      }
    );
  }
}
